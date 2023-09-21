/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IUntypedEditorInput, IMatchEditorOptions, EditorsOrder } from 'vs/workbench/common/editor';
import { EditorInput } from 'vs/workbench/common/editor/editorInput';
import { Emitter } from 'vs/base/common/event';
import { IGroupModelChangeEvent, IReadonlyEditorGroupModel } from 'vs/workbench/common/editor/editorGroupModel';
import { Disposable } from 'vs/base/common/lifecycle';

abstract class FilteredEditorGroupModel extends Disposable implements IReadonlyEditorGroupModel {

	private readonly _onDidModelChange = this._register(new Emitter<IGroupModelChangeEvent>());
	readonly onDidModelChange = this._onDidModelChange.event;

	constructor(
		protected readonly model: IReadonlyEditorGroupModel
	) {
		super();

		this._register(this.model.onDidModelChange(e => {
			const candidateOrIndex = e.editorIndex ?? e.editor;
			if (typeof candidateOrIndex === 'number' || candidateOrIndex) {
				if (!this.filter(candidateOrIndex)) {
					return; // exclude events for excluded items
				}
			}
			this._onDidModelChange.fire(e);
		}));
	}

	get id(): number { return this.model.id; }
	get isLocked(): boolean { return this.model.isLocked; }
	get stickyCount(): number { return this.model.stickyCount; }

	abstract get activeEditor(): EditorInput | null;
	abstract get previewEditor(): EditorInput | null;
	abstract get count(): number;
	abstract get isEmpty(): boolean;

	isPinned(editorOrIndex: number | EditorInput): boolean { return this.model.isPinned(editorOrIndex); }
	isSticky(editorOrIndex: number | EditorInput): boolean { return this.model.isSticky(editorOrIndex); }
	isActive(editor: EditorInput | IUntypedEditorInput): boolean { return this.model.isActive(editor); }

	findEditor(candidate: EditorInput | null, options?: IMatchEditorOptions | undefined): [EditorInput, number] | undefined {
		const result = this.model.findEditor(candidate, options);
		if (!result) {
			return undefined;
		}
		return this.filter(result[1]) ? result : undefined;
	}

	abstract isFirst(editor: EditorInput): boolean;
	abstract isLast(editor: EditorInput): boolean;
	abstract getEditorByIndex(index: number): EditorInput | undefined;
	abstract indexOf(editor: EditorInput): number;
	abstract getEditors(order: EditorsOrder, options?: { excludeSticky?: boolean }): readonly EditorInput[];
	abstract contains(candidate: EditorInput | IUntypedEditorInput, options?: IMatchEditorOptions | undefined): boolean;

	abstract filter(editorOrIndex: EditorInput | number): boolean;
}

export class StickyEditorGroupModel extends FilteredEditorGroupModel {
	get count(): number { return this.model.stickyCount; }
	override get stickyCount(): number { return this.count; }
	get isEmpty(): boolean { return this.model.stickyCount === 0; }
	get activeEditor(): EditorInput | null { return this.model.activeEditor && this.model.isSticky(this.model.activeEditor) ? this.model.activeEditor : null; }
	get previewEditor(): EditorInput | null { return this.model.previewEditor && this.model.isSticky(this.model.previewEditor) ? this.model.previewEditor : null; }

	override getEditors(order: EditorsOrder, options?: { excludeSticky?: boolean }): readonly EditorInput[] {
		if (options?.excludeSticky) {
			return [];
		}
		return this.model.getEditors(EditorsOrder.SEQUENTIAL).slice(0, this.model.stickyCount);
	}

	override isSticky(editorOrIndex: number | EditorInput): boolean {
		return true;
	}

	isFirst(editor: EditorInput): boolean {
		return this.model.isFirst(editor);
	}

	isLast(editor: EditorInput): boolean {
		return this.model.indexOf(editor) === this.model.stickyCount - 1;
	}

	getEditorByIndex(index: number): EditorInput | undefined {
		return index < this.count ? this.model.getEditorByIndex(index) : undefined;
	}

	indexOf(editor: EditorInput): number {
		const editorIndex = this.model.indexOf(editor);
		if (editorIndex < 0 || editorIndex >= this.model.stickyCount) {
			return -1;
		}
		return editorIndex;
	}

	contains(candidate: EditorInput | IUntypedEditorInput, options?: IMatchEditorOptions | undefined): boolean {
		const editorIndex = this.model.indexOf(candidate);
		return editorIndex >= 0 && editorIndex < this.model.stickyCount;
	}

	filter(candidateOrIndex: EditorInput | number): boolean {
		return this.model.isSticky(candidateOrIndex);
	}
}

export class UnstickyEditorGroupModel extends FilteredEditorGroupModel {
	get count(): number { return this.model.count - this.model.stickyCount; }
	override get stickyCount(): number { return 0; }
	get isEmpty(): boolean { return this.model.stickyCount === this.model.count; }
	get activeEditor(): EditorInput | null { return this.model.activeEditor && !this.model.isSticky(this.model.activeEditor) ? this.model.activeEditor : null; }
	get previewEditor(): EditorInput | null { return this.model.previewEditor && !this.model.isSticky(this.model.previewEditor) ? this.model.previewEditor : null; }

	override isSticky(editorOrIndex: number | EditorInput): boolean {
		return false;
	}

	override getEditors(order: EditorsOrder, options?: { excludeSticky?: boolean }): readonly EditorInput[] {
		return this.model.getEditors(EditorsOrder.SEQUENTIAL).slice(this.model.stickyCount);
	}

	isFirst(editor: EditorInput): boolean {
		return this.model.indexOf(editor) === this.model.stickyCount;
	}

	isLast(editor: EditorInput): boolean {
		return this.model.isLast(editor);
	}

	getEditorByIndex(index: number): EditorInput | undefined {
		return index >= 0 ? this.model.getEditorByIndex(index + this.model.stickyCount) : undefined;
	}

	indexOf(editor: EditorInput): number {
		const editorIndex = this.model.indexOf(editor);
		if (editorIndex < this.model.stickyCount || editorIndex >= this.model.count) {
			return -1;
		}
		return editorIndex - this.model.stickyCount;
	}

	contains(candidate: EditorInput | IUntypedEditorInput, options?: IMatchEditorOptions | undefined): boolean {
		const editorIndex = this.model.indexOf(candidate);
		return editorIndex >= this.model.stickyCount && editorIndex < this.model.count;
	}

	filter(candidateOrIndex: EditorInput | number): boolean {
		return !this.model.isSticky(candidateOrIndex);
	}
}
