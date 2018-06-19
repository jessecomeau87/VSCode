/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from 'vs/nls';
import { IJSONSchema } from 'vs/base/common/jsonSchema';
import { EXTENSION_IDENTIFIER_PATTERN } from 'vs/platform/extensionManagement/common/extensionManagement';

export const ExtensionsConfigurationSchemaId = 'vscode://schemas/extensions';
export const ExtensionsConfigurationSchema: IJSONSchema = {
	id: ExtensionsConfigurationSchemaId,
	allowComments: true,
	type: 'object',
	title: localize('app.extensions.json.title', "Extensions"),
	additionalProperties: false,
	properties: {
		recommendations: {
			type: 'array',
			description: localize('app.extensions.json.recommendations', "List of extensions which should be recommended for users of this workspace. The identifier of an extension is always '${publisher}.${name}'. For example: 'vscode.csharp'."),
			items: {
				type: 'string',
				pattern: EXTENSION_IDENTIFIER_PATTERN,
				errorMessage: localize('app.extension.identifier.errorMessage', "Expected format '${publisher}.${name}'. Example: 'vscode.csharp'.")
			},
		},
		unwantedRecommendations: {
			type: 'array',
			description: localize('app.extensions.json.unwantedRecommendations', "List of extensions that will be skipped from the recommendations that VS Code makes for the users of this workspace. These extensions may be irrelevant, redundant, or otherwise unwanted. The identifier of an extension is always '${publisher}.${name}'. For example: 'vscode.csharp'."),
			items: {
				type: 'string',
				pattern: EXTENSION_IDENTIFIER_PATTERN,
				errorMessage: localize('app.extension.identifier.errorMessage', "Expected format '${publisher}.${name}'. Example: 'vscode.csharp'.")
			},
		},
	}
};

export const ExtensionsConfigurationInitialContent: string = [
	'{',
	'\t// See http://go.microsoft.com/fwlink/?LinkId=827846',
	'\t// for the documentation about the extensions.json format',
	'\t"recommendations": [',
	'\t\t// List of extensions which should be recommended for users of this workspace.',
	'\t\t// Extension identifier format: ${publisher}.${name}. Example: vscode.csharp',
	'\t\t',
	'\t],',
	'\t"unwantedRecommendations": [',
	'\t\t// List of extensions that will be skipped from the recommendations that VS Code makes for the users of this workspace. These extensions may be irrelevant, redundant, or otherwise unwanted.',
	'\t\t// Extension identifier format: ${publisher}.${name}. Example: vscode.csharp',
	'\t\t',
	'\t]',
	'}'
].join('\n');