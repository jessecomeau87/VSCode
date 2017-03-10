/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as nls from 'vs/nls';
import * as defaultPlatform from 'vs/base/common/platform';
import { IHTMLContentElement } from 'vs/base/common/htmlContent';
import { Keybinding, SimpleKeybinding, KeyCode, KeyCodeUtils, USER_SETTINGS } from 'vs/base/common/keyCodes';

export interface ISimplifiedPlatform {
	isMacintosh: boolean;
	isWindows: boolean;
}

export class KeybindingLabels {

	private static _cachedKeybindingRegex: string = null;

	/**
	 * @internal
	 */
	public static getUserSettingsKeybindingRegex(): string {
		if (!this._cachedKeybindingRegex) {
			let numpadKey = 'numpad(0|1|2|3|4|5|6|7|8|9|_multiply|_add|_subtract|_decimal|_divide|_separator)';
			let oemKey = '`|\\-|=|\\[|\\]|\\\\\\\\|;|\'|,|\\.|\\/|oem_8|oem_102';
			let specialKey = 'left|up|right|down|pageup|pagedown|end|home|tab|enter|escape|space|backspace|delete|pausebreak|capslock|insert|contextmenu|numlock|scrolllock';
			let casualKey = '[a-z]|[0-9]|f(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19)';
			let key = '((' + [numpadKey, oemKey, specialKey, casualKey].join(')|(') + '))';
			let mod = '((ctrl|shift|alt|cmd|win|meta)\\+)*';
			let keybinding = '(' + mod + key + ')';

			this._cachedKeybindingRegex = '"\\s*(' + keybinding + '(\\s+' + keybinding + ')?' + ')\\s*"';
		}
		return this._cachedKeybindingRegex;
	}

	/**
	 * Format the binding to a format appropiate for the user settings file.
	 * @internal
	 */
	public static toUserSettingsLabel(keybinding: Keybinding, Platform: ISimplifiedPlatform = defaultPlatform): string {
		let result = _asString(keybinding, UserSettingsKeyLabelProvider.INSTANCE, Platform);
		result = result.toLowerCase();

		if (Platform.isMacintosh) {
			result = result.replace(/meta/g, 'cmd');
		} else if (Platform.isWindows) {
			result = result.replace(/meta/g, 'win');
		}

		return result;
	}

	/**
	 * Format the binding to a format appropiate for rendering in the UI
	 * @internal
	 */
	public static _toUSLabel(keybinding: Keybinding, Platform: ISimplifiedPlatform = defaultPlatform): string {
		return _asString(keybinding, (Platform.isMacintosh ? MacUIKeyLabelProvider.INSTANCE : ClassicUIKeyLabelProvider.INSTANCE), Platform);
	}

	/**
	 * Format the binding to a format appropiate for placing in an aria-label.
	 * @internal
	 */
	public static _toUSAriaLabel(keybinding: Keybinding, Platform: ISimplifiedPlatform = defaultPlatform): string {
		return _asString(keybinding, AriaKeyLabelProvider.INSTANCE, Platform);
	}

	/**
	 * Format the binding to a format appropiate for rendering in the UI
	 * @internal
	 */
	public static _toUSHTMLLabel(keybinding: Keybinding, Platform: ISimplifiedPlatform = defaultPlatform): IHTMLContentElement[] {
		return _asHTML(keybinding, (Platform.isMacintosh ? MacUIKeyLabelProvider.INSTANCE : ClassicUIKeyLabelProvider.INSTANCE), Platform);
	}

	/**
	 * Format the binding to a format appropiate for rendering in the UI
	 * @internal
	 */
	public static toCustomLabel(keybinding: Keybinding, labelProvider: IKeyBindingLabelProvider, Platform: ISimplifiedPlatform = defaultPlatform): string {
		return _asString(keybinding, labelProvider, Platform);
	}

	/**
	 * Format the binding to a format appropiate for rendering in the UI
	 * @internal
	 */
	public static toCustomHTMLLabel(keybinding: Keybinding, labelProvider: IKeyBindingLabelProvider, Platform: ISimplifiedPlatform = defaultPlatform): IHTMLContentElement[] {
		return _asHTML(keybinding, labelProvider, Platform);
	}

	/**
	 * This prints the binding in a format suitable for electron's accelerators.
	 * See https://github.com/electron/electron/blob/master/docs/api/accelerator.md
	 * @internal
	 */
	public static _toElectronAccelerator(keybinding: Keybinding, Platform: ISimplifiedPlatform = defaultPlatform): string {
		if (keybinding.isChord()) {
			// Electron cannot handle chords
			return null;
		}
		let keyCode = keybinding.getKeyCode();
		if (keyCode >= KeyCode.NUMPAD_0 && keyCode <= KeyCode.NUMPAD_DIVIDE) {
			// Electron cannot handle numpad keys
			return null;
		}
		return _asString(keybinding, ElectronAcceleratorLabelProvider.INSTANCE, Platform);
	}
}

export interface IKeyBindingLabelProvider {
	ctrlKeyLabel: string;
	shiftKeyLabel: string;
	altKeyLabel: string;
	cmdKeyLabel: string;
	windowsKeyLabel: string;
	modifierSeparator: string;
	getLabelForKey(keyCode: KeyCode): string;
}

/**
 * Print for Electron
 */
export class ElectronAcceleratorLabelProvider implements IKeyBindingLabelProvider {
	public static INSTANCE = new ElectronAcceleratorLabelProvider();

	public ctrlKeyLabel = 'Ctrl';
	public shiftKeyLabel = 'Shift';
	public altKeyLabel = 'Alt';
	public cmdKeyLabel = 'Cmd';
	public windowsKeyLabel = 'Super';
	public modifierSeparator = '+';

	public getLabelForKey(keyCode: KeyCode): string {
		switch (keyCode) {
			case KeyCode.UpArrow:
				return 'Up';
			case KeyCode.DownArrow:
				return 'Down';
			case KeyCode.LeftArrow:
				return 'Left';
			case KeyCode.RightArrow:
				return 'Right';
		}

		return KeyCodeUtils.toString(keyCode);
	}
}

/**
 * Print for Mac UI
 */
export class MacUIKeyLabelProvider implements IKeyBindingLabelProvider {
	public static INSTANCE = new MacUIKeyLabelProvider();

	private static leftArrowUnicodeLabel = '←';
	private static upArrowUnicodeLabel = '↑';
	private static rightArrowUnicodeLabel = '→';
	private static downArrowUnicodeLabel = '↓';

	public ctrlKeyLabel = '⌃';
	public shiftKeyLabel = '⇧';
	public altKeyLabel = '⌥';
	public cmdKeyLabel = '⌘';
	public windowsKeyLabel = nls.localize('windowsKey', "Windows");
	public modifierSeparator = '';

	public getLabelForKey(keyCode: KeyCode): string {
		switch (keyCode) {
			case KeyCode.LeftArrow:
				return MacUIKeyLabelProvider.leftArrowUnicodeLabel;
			case KeyCode.UpArrow:
				return MacUIKeyLabelProvider.upArrowUnicodeLabel;
			case KeyCode.RightArrow:
				return MacUIKeyLabelProvider.rightArrowUnicodeLabel;
			case KeyCode.DownArrow:
				return MacUIKeyLabelProvider.downArrowUnicodeLabel;
		}

		return KeyCodeUtils.toString(keyCode);
	}
}

/**
 * Aria label provider for Mac.
 */
export class AriaKeyLabelProvider implements IKeyBindingLabelProvider {
	public static INSTANCE = new AriaKeyLabelProvider();

	public ctrlKeyLabel = nls.localize('ctrlKey.long', "Control");
	public shiftKeyLabel = nls.localize('shiftKey.long', "Shift");
	public altKeyLabel = nls.localize('altKey.long', "Alt");
	public cmdKeyLabel = nls.localize('cmdKey.long', "Command");
	public windowsKeyLabel = nls.localize('windowsKey.long', "Windows");
	public modifierSeparator = '+';

	public getLabelForKey(keyCode: KeyCode): string {
		return KeyCodeUtils.toString(keyCode);
	}
}

/**
 * Print for Windows, Linux UI
 */
export class ClassicUIKeyLabelProvider implements IKeyBindingLabelProvider {
	public static INSTANCE = new ClassicUIKeyLabelProvider();

	public ctrlKeyLabel = nls.localize('ctrlKey', "Ctrl");
	public shiftKeyLabel = nls.localize('shiftKey', "Shift");
	public altKeyLabel = nls.localize('altKey', "Alt");
	public cmdKeyLabel = nls.localize('cmdKey', "Command");
	public windowsKeyLabel = nls.localize('windowsKey', "Windows");
	public modifierSeparator = '+';

	public getLabelForKey(keyCode: KeyCode): string {
		return KeyCodeUtils.toString(keyCode);
	}
}

/**
 * Print for the user settings file.
 */
class UserSettingsKeyLabelProvider implements IKeyBindingLabelProvider {
	public static INSTANCE = new UserSettingsKeyLabelProvider();

	public ctrlKeyLabel = 'Ctrl';
	public shiftKeyLabel = 'Shift';
	public altKeyLabel = 'Alt';
	public cmdKeyLabel = 'Meta';
	public windowsKeyLabel = 'Meta';

	public modifierSeparator = '+';

	public getLabelForKey(keyCode: KeyCode): string {
		return USER_SETTINGS.fromKeyCode(keyCode);
	}
}

export class PrintableKeypress {

	public static fromKeybinding(keybinding: SimpleKeybinding, labelProvider: IKeyBindingLabelProvider, Platform: ISimplifiedPlatform): PrintableKeypress {
		const ctrlCmd = keybinding.hasCtrlCmd();
		const winCtrl = keybinding.hasWinCtrl();

		const ctrlKey = Platform.isMacintosh ? winCtrl : ctrlCmd;
		const metaKey = Platform.isMacintosh ? ctrlCmd : winCtrl;
		const shiftKey = keybinding.hasShift();
		const altKey = keybinding.hasAlt();

		const keyCode = keybinding.getKeyCode();
		const keyLabel = labelProvider.getLabelForKey(keyCode) || '';

		return new PrintableKeypress(ctrlKey, shiftKey, altKey, metaKey, keyLabel);
	}

	readonly ctrlKey: boolean;
	readonly shiftKey: boolean;
	readonly altKey: boolean;
	readonly metaKey: boolean;
	readonly key: string;

	constructor(ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean, key: string) {
		this.ctrlKey = ctrlKey;
		this.shiftKey = shiftKey;
		this.altKey = altKey;
		this.metaKey = metaKey;
		this.key = key;
	}
}

function _simpleAsString(keypress: PrintableKeypress, labelProvider: IKeyBindingLabelProvider, Platform: ISimplifiedPlatform): string {
	if (!keypress.key) {
		return '';
	}

	let result: string[] = [];

	// translate modifier keys: Ctrl-Shift-Alt-Meta
	if (keypress.ctrlKey) {
		result.push(labelProvider.ctrlKeyLabel);
	}

	if (keypress.shiftKey) {
		result.push(labelProvider.shiftKeyLabel);
	}

	if (keypress.altKey) {
		result.push(labelProvider.altKeyLabel);
	}

	if (keypress.metaKey) {
		result.push(Platform.isMacintosh ? labelProvider.cmdKeyLabel : labelProvider.windowsKeyLabel);
	}

	// the actual key
	result.push(keypress.key);

	return result.join(labelProvider.modifierSeparator);
}

function _asString(keybinding: Keybinding, labelProvider: IKeyBindingLabelProvider, Platform: ISimplifiedPlatform): string {
	if (keybinding.isChord()) {
		const firstPart = PrintableKeypress.fromKeybinding(keybinding.extractFirstPart(), labelProvider, Platform);
		const secondPart = PrintableKeypress.fromKeybinding(keybinding.extractChordPart(), labelProvider, Platform);
		return (
			_simpleAsString(firstPart, labelProvider, Platform)
			+ ' '
			+ _simpleAsString(secondPart, labelProvider, Platform)
		);
	} else {
		const printableKeypress = PrintableKeypress.fromKeybinding(keybinding, labelProvider, Platform);
		return _simpleAsString(printableKeypress, labelProvider, Platform);
	}
}

function _pushKey(result: IHTMLContentElement[], str: string, append: string): void {
	result.push({
		tagName: 'span',
		className: 'monaco-kbkey',
		text: str
	});
	if (append) {
		result.push({
			tagName: 'span',
			text: '+'
		});
	}
}

function _simpleAsHTML(result: IHTMLContentElement[], keypress: PrintableKeypress, labelProvider: IKeyBindingLabelProvider, Platform: ISimplifiedPlatform): void {
	if (!keypress.key) {
		return;
	}

	// translate modifier keys: Ctrl-Shift-Alt-Meta
	if (keypress.ctrlKey) {
		_pushKey(result, labelProvider.ctrlKeyLabel, labelProvider.modifierSeparator);
	}

	if (keypress.shiftKey) {
		_pushKey(result, labelProvider.shiftKeyLabel, labelProvider.modifierSeparator);
	}

	if (keypress.altKey) {
		_pushKey(result, labelProvider.altKeyLabel, labelProvider.modifierSeparator);
	}

	if (keypress.metaKey) {
		_pushKey(result, Platform.isMacintosh ? labelProvider.cmdKeyLabel : labelProvider.windowsKeyLabel, labelProvider.modifierSeparator);
	}

	// the actual key
	_pushKey(result, keypress.key, null);
}

function _asHTML(keybinding: Keybinding, labelProvider: IKeyBindingLabelProvider, Platform: ISimplifiedPlatform): IHTMLContentElement[] {
	let result: IHTMLContentElement[] = [];
	if (keybinding.isChord()) {
		const firstPart = PrintableKeypress.fromKeybinding(keybinding.extractFirstPart(), labelProvider, Platform);
		const secondPart = PrintableKeypress.fromKeybinding(keybinding.extractChordPart(), labelProvider, Platform);

		_simpleAsHTML(result, firstPart, labelProvider, Platform);
		result.push({
			tagName: 'span',
			text: ' '
		});
		_simpleAsHTML(result, secondPart, labelProvider, Platform);
	} else {
		const printableKeypress = PrintableKeypress.fromKeybinding(keybinding, labelProvider, Platform);

		_simpleAsHTML(result, printableKeypress, labelProvider, Platform);
	}

	return [{
		tagName: 'span',
		className: 'monaco-kb',
		children: result
	}];
}
