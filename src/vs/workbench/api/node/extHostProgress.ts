/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { Progress, ProgressOptions, CancellationToken } from 'vscode';
import { MainThreadProgressShape, ExtHostProgressShape } from './extHost.protocol';
import { ProgressLocation } from './extHostTypeConverters';
import { IExtensionDescription } from 'vs/workbench/services/extensions/common/extensions';
import { IProgressStep } from 'vs/platform/progress/common/progress';
import { localize } from 'vs/nls';
import { CancellationTokenSource } from 'vs/base/common/cancellation';

export class ExtHostProgress implements ExtHostProgressShape {

	private _proxy: MainThreadProgressShape;
	private _handles: number = 0;
	private _mapHandleToCancellationSource: Map<number, CancellationTokenSource> = new Map();

	constructor(proxy: MainThreadProgressShape) {
		this._proxy = proxy;
	}

	withProgress<R>(extension: IExtensionDescription, options: ProgressOptions, task: (progress: Progress<IProgressStep>, token: CancellationToken) => Thenable<R>): Thenable<R> {
		const handle = this._handles++;
		const { title, location, total } = options;
		const source = localize('extensionSource', "{0} (Extension)", extension.displayName || extension.name);
		this._proxy.$startProgress(handle, { location: ProgressLocation.from(location), title, source, total });
		return this._withProgress(handle, task);
	}

	private _withProgress<R>(handle: number, task: (progress: Progress<IProgressStep>, token: CancellationToken) => Thenable<R>): Thenable<R> {
		const source = new CancellationTokenSource();
		this._mapHandleToCancellationSource.set(handle, source);

		const progress = {
			report: (p: IProgressStep) => {
				this._proxy.$progressReport(handle, p);
			}
		};

		const progressEnd = (handle: number): void => {
			this._proxy.$progressEnd(handle);
			this._mapHandleToCancellationSource.delete(handle);
		};

		let p: Thenable<R>;

		try {
			p = task(progress, source.token);
		} catch (err) {
			progressEnd(handle);
			throw err;
		}

		p.then(result => progressEnd(handle), err => progressEnd(handle));
		return p;
	}

	public $acceptProgressCanceled(handle: number): void {
		const source = this._mapHandleToCancellationSource.get(handle);
		if (source) {
			source.cancel();
			this._mapHandleToCancellationSource.delete(handle);
		}
	}
}

