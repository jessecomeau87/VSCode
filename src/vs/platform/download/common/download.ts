/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { URI } from 'vs/base/common/uri';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { TPromise } from 'vs/base/common/winjs.base';
import { CancellationToken } from 'vs/base/common/cancellation';

export const IDownloadService = createDecorator<IDownloadService>('downloadService');

export interface IDownloadService {

	_serviceBrand: any;

	download(uri: URI, to: string, cancellationToken?: CancellationToken): TPromise<void>;

}