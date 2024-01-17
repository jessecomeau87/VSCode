/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from 'vs/nls';
import { firstOrDefault } from 'vs/base/common/arrays';
import { CancellationToken } from 'vs/base/common/cancellation';
import { Emitter, Event } from 'vs/base/common/event';
import { Disposable, IDisposable, toDisposable } from 'vs/base/common/lifecycle';
import { IContextKeyService, RawContextKey } from 'vs/platform/contextkey/common/contextkey';
import { ExtensionIdentifier } from 'vs/platform/extensions/common/extensions';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { ILogService } from 'vs/platform/log/common/log';

export const ISpeechService = createDecorator<ISpeechService>('speechService');

export const HasSpeechProvider = new RawContextKey<boolean>('hasSpeechProvider', false, { type: 'string', description: localize('hasSpeechProvider', "A speech provider is registered to the speech service.") });

export interface ISpeechProviderMetadata {
	readonly extension: ExtensionIdentifier;
	readonly displayName: string;
}

export enum SpeechToTextStatus {
	Started = 1,
	Recognizing = 2,
	Recognized = 3,
	Stopped = 4
}

export interface ISpeechToTextEvent {
	readonly status: SpeechToTextStatus;
	readonly text?: string;
}

export interface ISpeechToTextSession extends IDisposable {
	readonly onDidChange: Event<ISpeechToTextEvent>;
}

export enum KeywordRecognitionStatus {
	Recognized = 1,
	Stopped = 2
}

export interface IKeywordRecognitionEvent {
	readonly status: KeywordRecognitionStatus;
	readonly text?: string;
}

export interface IKeywordRecognitionSession extends IDisposable {
	readonly onDidChange: Event<IKeywordRecognitionEvent>;
}

export interface ISpeechProvider {
	readonly metadata: ISpeechProviderMetadata;

	createSpeechToTextSession(token: CancellationToken): ISpeechToTextSession;
	createKeywordRecognitionSession(token: CancellationToken): IKeywordRecognitionSession;
}

export interface ISpeechService {

	readonly _serviceBrand: undefined;

	readonly onDidRegisterSpeechProvider: Event<ISpeechProvider>;
	readonly onDidUnregisterSpeechProvider: Event<ISpeechProvider>;

	readonly hasSpeechProvider: boolean;

	registerSpeechProvider(identifier: string, provider: ISpeechProvider): IDisposable;

	readonly onDidStartSpeechToTextSession: Event<void>;
	readonly onDidEndSpeechToTextSession: Event<void>;

	readonly hasActiveSpeechToTextSession: boolean;

	/**
	 * Starts to transcribe speech from the default microphone. The returned
	 * session object provides an event to subscribe for transcribed text.
	 */
	createSpeechToTextSession(token: CancellationToken): ISpeechToTextSession;

	/**
	 * Starts to recognize a keyword from the default microphone. The returned
	 * status indicates if the keyword was recognized or if the session was
	 * stopped.
	 */
	recognizeKeyword(token: CancellationToken): Promise<KeywordRecognitionStatus>;
}

export class SpeechService extends Disposable implements ISpeechService {

	readonly _serviceBrand: undefined;

	private readonly _onDidRegisterSpeechProvider = this._register(new Emitter<ISpeechProvider>());
	readonly onDidRegisterSpeechProvider = this._onDidRegisterSpeechProvider.event;

	private readonly _onDidUnregisterSpeechProvider = this._register(new Emitter<ISpeechProvider>());
	readonly onDidUnregisterSpeechProvider = this._onDidUnregisterSpeechProvider.event;

	get hasSpeechProvider(): boolean { return this.providers.size > 0; }

	private readonly providers = new Map<string, ISpeechProvider>();

	private readonly hasSpeechProviderContext = HasSpeechProvider.bindTo(this.contextKeyService);

	constructor(
		@ILogService private readonly logService: ILogService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService
	) {
		super();
	}

	registerSpeechProvider(identifier: string, provider: ISpeechProvider): IDisposable {
		if (this.providers.has(identifier)) {
			throw new Error(`Speech provider with identifier ${identifier} is already registered.`);
		}

		this.providers.set(identifier, provider);
		this.hasSpeechProviderContext.set(true);

		this._onDidRegisterSpeechProvider.fire(provider);

		return toDisposable(() => {
			this.providers.delete(identifier);
			this._onDidUnregisterSpeechProvider.fire(provider);

			if (this.providers.size === 0) {
				this.hasSpeechProviderContext.set(false);
			}
		});
	}

	private readonly _onDidStartSpeechToTextSession = this._register(new Emitter<void>());
	readonly onDidStartSpeechToTextSession = this._onDidStartSpeechToTextSession.event;

	private readonly _onDidEndSpeechToTextSession = this._register(new Emitter<void>());
	readonly onDidEndSpeechToTextSession = this._onDidEndSpeechToTextSession.event;

	private _activeSpeechToTextSession: ISpeechToTextSession | undefined = undefined;
	get hasActiveSpeechToTextSession(): boolean { return !!this._activeSpeechToTextSession; }

	createSpeechToTextSession(token: CancellationToken): ISpeechToTextSession {
		const provider = firstOrDefault(Array.from(this.providers.values()));
		if (!provider) {
			throw new Error(`No Speech provider is registered.`);
		} else if (this.providers.size > 1) {
			this.logService.warn(`Multiple speech providers registered. Picking first one: ${provider.metadata.displayName}`);
		}

		const session = this._activeSpeechToTextSession = provider.createSpeechToTextSession(token);

		const disposable = session.onDidChange(e => {
			if (session !== this._activeSpeechToTextSession) {
				return; // not the latest anymore
			}

			switch (e.status) {
				case SpeechToTextStatus.Started:
					this._onDidStartSpeechToTextSession.fire();
					break;
				case SpeechToTextStatus.Stopped:
					this._activeSpeechToTextSession = undefined;
					this._onDidEndSpeechToTextSession.fire();
					disposable.dispose();
					break;
			}
		});

		return session;
	}

	async recognizeKeyword(token: CancellationToken): Promise<KeywordRecognitionStatus> {
		const provider = firstOrDefault(Array.from(this.providers.values()));
		if (!provider) {
			throw new Error(`No Speech provider is registered.`);
		} else if (this.providers.size > 1) {
			this.logService.warn(`Multiple speech providers registered. Picking first one: ${provider.metadata.displayName}`);
		}

		const session = provider.createKeywordRecognitionSession(token);
		return (await Event.toPromise(session.onDidChange)).status;
	}
}
