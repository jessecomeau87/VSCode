/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { workspace, commands, window, Uri, WorkspaceEdit, Range, TextDocument, extensions } from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { GitExtension, API, Repository, Status } from '../api/git';
import { eventToPromise } from '../util';

suite('git smoke test', function () {
	const cwd = fs.realpathSync(workspace.workspaceFolders![0].uri.fsPath);

	function file(relativePath: string) {
		return path.join(cwd, relativePath);
	}

	function uri(relativePath: string) {
		return Uri.file(file(relativePath));
	}

	async function open(relativePath: string) {
		const doc = await workspace.openTextDocument(uri(relativePath));
		await window.showTextDocument(doc);
		return doc;
	}

	async function type(doc: TextDocument, text: string) {
		const edit = new WorkspaceEdit();
		const end = doc.lineAt(doc.lineCount - 1).range.end;
		edit.replace(doc.uri, new Range(end, end), text);
		await workspace.applyEdit(edit);
	}

	let git: API;
	let repository: Repository;

	suiteSetup(async function () {
		fs.writeFileSync(file('app.js'), 'hello', 'utf8');
		fs.writeFileSync(file('index.pug'), 'hello', 'utf8');
		cp.execSync('git init', { cwd });
		cp.execSync('git config user.name testuser', { cwd });
		cp.execSync('git config user.email monacotools@microsoft.com', { cwd });
		cp.execSync('git add .', { cwd });
		cp.execSync('git commit -m "initial commit"', { cwd });

		// make sure git is activated
		const ext = extensions.getExtension<GitExtension>('vscode.git');
		await ext?.activate();
		git = ext!.exports.getAPI(1);

		if (git.repositories.length === 0) {
			await eventToPromise(git.onDidOpenRepository);
		}

		assert.equal(git.repositories.length, 1);
		assert.equal(fs.realpathSync(git.repositories[0].rootUri.fsPath), cwd);

		repository = git.repositories[0];
	});

	test('reflects working tree changes', async function () {
		await commands.executeCommand('workbench.view.scm');

		const appjs = await open('app.js');
		await type(appjs, ' world');
		await appjs.save();
		await repository.status();
		assert.equal(repository.state.workingTreeChanges.length, 1);
		repository.state.workingTreeChanges.some(r => r.uri.path === appjs.uri.path && r.status === Status.MODIFIED);

		fs.writeFileSync(file('newfile.txt'), '');
		const newfile = await open('newfile.txt');
		await type(newfile, 'hey there');
		await newfile.save();
		await repository.status();
		assert.equal(repository.state.workingTreeChanges.length, 2);
		repository.state.workingTreeChanges.some(r => r.uri.path === appjs.uri.path && r.status === Status.MODIFIED);
		repository.state.workingTreeChanges.some(r => r.uri.path === newfile.uri.path && r.status === Status.UNTRACKED);
	});

	test('opens diff editor', async function () {
		const appjs = uri('app.js');
		await commands.executeCommand('git.openChange', appjs);

		assert(window.activeTextEditor);
		assert.equal(window.activeTextEditor!.document.uri.path, appjs.path);

		// TODO: how do we really know this is a diff editor?
	});

	test('stages correctly', async function () {
		const appjs = uri('app.js');
		const newfile = uri('newfile.txt');

		await commands.executeCommand('git.stage', appjs);
		assert.equal(repository.state.workingTreeChanges.length, 1);
		repository.state.workingTreeChanges.some(r => r.uri.path === newfile.path && r.status === Status.UNTRACKED);
		assert.equal(repository.state.indexChanges.length, 1);
		repository.state.indexChanges.some(r => r.uri.path === appjs.path && r.status === Status.INDEX_MODIFIED);

		await commands.executeCommand('git.unstage', appjs);
		assert.equal(repository.state.workingTreeChanges.length, 2);
		repository.state.workingTreeChanges.some(r => r.uri.path === appjs.path && r.status === Status.MODIFIED);
		repository.state.workingTreeChanges.some(r => r.uri.path === newfile.path && r.status === Status.UNTRACKED);
	});

	test('stages, commits changes and verifies outgoing change', async function () {
		const appjs = uri('app.js');
		const newfile = uri('newfile.txt');

		await commands.executeCommand('git.stage', appjs);
		await repository.commit('second commit');
		assert.equal(repository.state.workingTreeChanges.length, 1);
		repository.state.workingTreeChanges.some(r => r.uri.path === newfile.path && r.status === Status.UNTRACKED);
		assert.equal(repository.state.indexChanges.length, 0);

		await commands.executeCommand('git.stageAll', appjs);
		await repository.commit('third commit');
		assert.equal(repository.state.workingTreeChanges.length, 0);
		assert.equal(repository.state.indexChanges.length, 0);
	});
		
	test('rename/delete conflict', async function () {
		cp.execSync('git branch test', { cwd });
		cp.execSync('git checkout test', { cwd });

		fs.unlinkSync(file('app.js'));
		cp.execSync('git add .', { cwd });

		await repository.commit('commit on test');
		cp.execSync('git checkout master', { cwd });

		fs.renameSync(file('app.js'), file('rename.js'));
		cp.execSync('git add .', { cwd });
		await repository.commit('commit on master');

		try {
			cp.execSync('git merge test', { cwd });
		} catch (e) {}
		await new Promise(resolve => setTimeout(resolve, 5e3));

		await commands.executeCommand('workbench.scm.focus');
		await new Promise(resolve => setTimeout(resolve, 5e3));
	});
});
