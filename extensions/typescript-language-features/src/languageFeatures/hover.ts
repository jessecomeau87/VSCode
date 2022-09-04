/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
import { URI } from 'vscode-uri';
import type * as Proto from '../protocol';
import { ClientCapability, ITypeScriptServiceClient, ServerType } from '../typescriptService';
import { conditionalRegistration, requireSomeCapability } from '../utils/dependentRegistration';
import { DocumentSelector } from '../utils/documentSelector';
import { markdownDocumentation } from '../utils/previewer';
import * as typeConverters from '../utils/typeConverters';
import FileConfigurationManager from './fileConfigurationManager';

const localize = nls.loadMessageBundle();


class TypeScriptHoverProvider implements vscode.HoverProvider {

	public constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly fileConfigurationManager: FileConfigurationManager,
	) { }

	public async provideHover(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): Promise<vscode.Hover | undefined> {
		const filepath = this.client.toOpenedFilePath(document);
		if (!filepath) {
			return undefined;
		}

		const { quickinfo, definition } = await this.client.interruptGetErr(async () => {
			await this.fileConfigurationManager.ensureConfigurationForDocument(document, token);

			const args = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
			const quickinfo = await this.client.execute('quickinfo', args, token);
			const definition = await this.client.execute('definition', args, token);
			return { quickinfo, definition };
		});

		if (quickinfo.type !== 'response' || !quickinfo.body) {
			return undefined;
		}

		let resource = document.uri;
		if (definition.type === 'response' && definition.body) {
			const firstDefinitionFile = definition.body?.[0].file;
			resource = URI.revive(vscode.Uri.file(firstDefinitionFile));
		}

		return new vscode.Hover(
			this.getContents(resource, quickinfo.body, quickinfo._serverType),
			typeConverters.Range.fromTextSpan(quickinfo.body));
	}

	private getContents(
		resource: vscode.Uri,
		data: Proto.QuickInfoResponseBody,
		source: ServerType | undefined
	) {
		const parts: vscode.MarkdownString[] = [];

		if (data.displayString) {
			const displayParts: string[] = [];

			if (source === ServerType.Syntax && this.client.hasCapabilityForResource(resource, ClientCapability.Semantic)) {
				displayParts.push(
					localize({
						key: 'loadingPrefix',
						comment: ['Prefix displayed for hover entries while the server is still loading']
					}, "(loading...)"));
			}

			displayParts.push(data.displayString);
			parts.push(new vscode.MarkdownString().appendCodeblock(displayParts.join(' '), 'typescript'));
		}
		const md = markdownDocumentation(data.documentation, data.tags, this.client, resource);
		parts.push(md);
		return parts;
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
	fileConfigurationManager: FileConfigurationManager,
): vscode.Disposable {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.EnhancedSyntax, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerHoverProvider(selector.syntax,
			new TypeScriptHoverProvider(client, fileConfigurationManager));
	});
}
