/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, Emitter } from 'vs/base/common/event';
import { IUpdateService, State, UpdateType, IUpdate } from 'vs/platform/update/common/update';
import { registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { IWorkbenchEnvironmentService } from 'vs/workbench/services/environment/common/environmentService';
import { IWindowService } from 'vs/platform/windows/common/windows';
import { Disposable } from 'vs/base/common/lifecycle';

export interface IUpdateProvider {

	/**
	 * Should return with the `IUpdate` object if an update is
	 * available or `null` otherwise to signal that there are
	 * no updates.
	 */
	checkForUpdate(): Promise<IUpdate | null>;
}

export class UpdateService extends Disposable implements IUpdateService {

	_serviceBrand: undefined;

	private _onStateChange = this._register(new Emitter<State>());
	readonly onStateChange: Event<State> = this._onStateChange.event;

	private _state: State = State.Uninitialized;
	get state(): State { return this._state; }
	set state(state: State) {
		this._state = state;
		this._onStateChange.fire(state);
	}

	constructor(
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IWindowService private readonly windowService: IWindowService
	) {
		super();

		this.checkForUpdates();
	}

	async isLatestVersion(): Promise<boolean> {
		const update = await this.doCheckForUpdates();

		return !!update;
	}

	async checkForUpdates(): Promise<void> {
		await this.doCheckForUpdates();
	}

	private async doCheckForUpdates(): Promise<IUpdate | null> {
		if (this.environmentService.options && this.environmentService.options.updateProvider) {
			const updateProvider = this.environmentService.options.updateProvider;

			// State -> Checking for Updates
			this.state = State.CheckingForUpdates(null);

			const update = await updateProvider.checkForUpdate();
			if (update) {
				// State -> Downloaded
				this.state = State.Ready(update);
			} else {
				// State -> Idle
				this.state = State.Idle(UpdateType.Archive);
			}

			return update;
		}

		return null; // no update provider to ask
	}

	async downloadUpdate(): Promise<void> {
		// no-op
	}

	async applyUpdate(): Promise<void> {
		this.windowService.reloadWindow();
	}

	async quitAndInstall(): Promise<void> {
		this.windowService.reloadWindow();
	}
}

registerSingleton(IUpdateService, UpdateService);
