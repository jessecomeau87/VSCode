/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EventEmitter, Memento, Uri, workspace } from 'vscode';
import { getOctokit } from './auth';
import { API, BranchProtection, BranchProtectionProvider, Repository } from './typings/git';
import { DisposableStore, getRepositoryFromUrl } from './util';

interface RepositoryRuleset {
	readonly id: number;
	readonly conditions: {
		ref_name: {
			exclude: string[];
			include: string[];
		};
	};
	readonly enforcement: 'active' | 'disabled' | 'evaluate';
	readonly rules: RepositoryRule[];
	readonly target: 'branch' | 'tag';
}

interface RepositoryRule {
	readonly type: string;
}

export class GithubBranchProtectionProviderManager {

	private readonly disposables = new DisposableStore();
	private readonly providerDisposables = new DisposableStore();

	private _enabled = false;
	private set enabled(enabled: boolean) {
		if (this._enabled === enabled) {
			return;
		}

		if (enabled) {
			for (const repository of this.gitAPI.repositories) {
				this.providerDisposables.add(this.gitAPI.registerBranchProtectionProvider(repository.rootUri, new GithubBranchProtectionProvider(repository, this.globalState)));
			}
		} else {
			this.providerDisposables.dispose();
		}

		this._enabled = enabled;
	}

	constructor(private readonly gitAPI: API, private readonly globalState: Memento) {
		this.disposables.add(this.gitAPI.onDidOpenRepository(repository => {
			if (this._enabled) {
				this.providerDisposables.add(gitAPI.registerBranchProtectionProvider(repository.rootUri, new GithubBranchProtectionProvider(repository, this.globalState)));
			}
		}));

		this.disposables.add(workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('github.branchProtection')) {
				this.updateEnablement();
			}
		}));

		this.updateEnablement();
	}

	private updateEnablement(): void {
		const config = workspace.getConfiguration('github', null);
		this.enabled = config.get<boolean>('branchProtection', true) === true;
	}

	dispose(): void {
		this.enabled = false;
		this.disposables.dispose();
	}

}

export class GithubBranchProtectionProvider implements BranchProtectionProvider {
	private readonly _onDidChangeBranchProtection = new EventEmitter<Uri>();
	onDidChangeBranchProtection = this._onDidChangeBranchProtection.event;

	private branchProtection: BranchProtection[];
	private readonly globalStateKey = `branchProtection:${this.repository.rootUri.toString()}`;

	constructor(private readonly repository: Repository, private readonly globalState: Memento) {
		// Restore branch protection from global state
		this.branchProtection = this.globalState.get<BranchProtection[]>(this.globalStateKey, []);

		repository.status()
			.then(() => this.initializeBranchProtection());
	}

	provideBranchProtection(): BranchProtection[] {
		return this.branchProtection;
	}

	private async initializeBranchProtection(): Promise<void> {
		// Branch protection (HEAD)
		await this.updateHEADBranchProtection();

		// Branch protection (remotes)
		await this.updateBranchProtection();
	}

	private async hasPushPermission(repository: { owner: string; repo: string }): Promise<boolean> {
		try {
			const octokit = await getOctokit();
			const response = await octokit.repos.get({ ...repository });

			return response.data.permissions?.push === true;
		} catch {
			// todo@lszomoru - add logging
			return false;
		}
	}

	private async getBranchRules(repository: { owner: string; repo: string }, branch: string): Promise<RepositoryRule[]> {
		try {
			const octokit = await getOctokit();
			const response = await octokit.request('/repos/{owner}/{repo}/rules/branches/{branch}', {
				...repository,
				branch,
				headers: {
					'X-GitHub-Api-Version': '2022-11-28'
				}
			});
			return response.data as RepositoryRule[];
		} catch {
			// todo@lszomoru - add logging
			return [];
		}
	}

	private async getRepositoryDefaultBranch(repository: { owner: string; repo: string }): Promise<string | undefined> {
		try {
			const octokit = await getOctokit();
			const response = await octokit.repos.get({ ...repository });
			return response.data.default_branch;
		} catch {
			// todo@lszomoru - add logging
			return undefined;
		}
	}

	private async getRepositoryRuleset(repository: { owner: string; repo: string }, id: number): Promise<RepositoryRuleset | undefined> {
		try {
			const octokit = await getOctokit();
			const response = await octokit.request('GET /repos/{owner}/{repo}/rulesets/{id}', {
				...repository,
				id,
				headers: {
					'X-GitHub-Api-Version': '2022-11-28'
				}
			});
			return response.data as RepositoryRuleset;
		} catch {
			// todo@lszomoru - add logging
			return undefined;
		}
	}

	private async getRepositoryRulesets(repository: { owner: string; repo: string }): Promise<RepositoryRuleset[]> {
		const rulesets: RepositoryRuleset[] = [];

		try {
			const octokit = await getOctokit();
			for await (const response of octokit.paginate.iterator('GET /repos/{owner}/{repo}/rulesets', { ...repository })) {
				if (response.status !== 200) {
					continue;
				}

				for (const ruleset of response.data as RepositoryRuleset[]) {
					if (ruleset.target !== 'branch' || ruleset.enforcement !== 'active') {
						continue;
					}

					const rulesetWithDetails = await this.getRepositoryRuleset(repository, ruleset.id);
					if (rulesetWithDetails?.rules.find(r => r.type === 'pull_request')) {
						rulesets.push(rulesetWithDetails);
					}
				}
			}

			return rulesets;
		}
		catch {
			// todo@lszomoru - add logging
			return rulesets;
		}
	}

	private async updateHEADBranchProtection(): Promise<void> {
		try {
			const HEAD = this.repository.state.HEAD;

			if (!HEAD?.name || !HEAD?.upstream?.remote) {
				return;
			}

			const remoteName = HEAD.upstream.remote;
			const remote = this.repository.state.remotes.find(r => r.name === remoteName);

			if (!remote) {
				return;
			}

			const repository = getRepositoryFromUrl(remote.pushUrl ?? remote.fetchUrl ?? '');

			if (!repository) {
				return;
			}

			if (!(await this.hasPushPermission(repository))) {
				return;
			}

			const rules = await this.getBranchRules(repository, HEAD.name);
			if (!rules.find(r => r.type === 'pull_request')) {
				return;
			}

			this.branchProtection = [{ remote: remote.name, branches: [HEAD.name] }];
			this._onDidChangeBranchProtection.fire(this.repository.rootUri);
		} catch (err) {
			// todo@lszomoru - add logging
		}
	}

	private async updateBranchProtection(): Promise<void> {
		try {
			const branchProtection: BranchProtection[] = [];

			for (const remote of this.repository.state.remotes) {
				const repository = getRepositoryFromUrl(remote.pushUrl ?? remote.fetchUrl ?? '');

				if (!repository) {
					continue;
				}

				if (!(await this.hasPushPermission(repository))) {
					continue;
				}

				const rulesets = await this.getRepositoryRulesets(repository);

				// All branches (~ALL)
				if (rulesets.find(r => r.conditions.ref_name.include.includes('~ALL'))) {
					branchProtection.push({ remote: remote.name, branches: ['**'] });
					continue;
				}





				// Default branch (~DEFAULT_BRANCH)

				// Protected branches




			}

			this.branchProtection = branchProtection;
			this._onDidChangeBranchProtection.fire(this.repository.rootUri);

			// Save branch protection to global state
			await this.globalState.update(this.globalStateKey, branchProtection);
		} catch {
			// todo@lszomoru - add logging
		}
	}

}
