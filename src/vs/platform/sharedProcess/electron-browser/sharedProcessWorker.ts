/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISharedProcessWorkerConfiguration } from 'vs/platform/sharedProcess/common/sharedProcessWorkerService';

export enum SharedProcessWorkerMessages {

	// Message Port Exchange
	RequestPort = 'vscode:requestSharedProcessWorkerPort',
	ReceivePort = 'vscode:receiveSharedProcessWorkerPort',

	// Lifecycle
	WorkerReady = 'vscode:sharedProcessWorkerReady'
}

export interface ISharedProcessWorkerEnvironment {

	/**
	 * Full absolute path to our `bootstrap-fork.js` file.
	 */
	bootstrapPath: string;
}

export interface ISharedProcessWorkerMessage {
	id: string;
	configuration: ISharedProcessWorkerConfiguration;
	environment: ISharedProcessWorkerEnvironment;
}
