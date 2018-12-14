/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { isPlatformServer } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, Output, PLATFORM_ID, Renderer2, SecurityContext, ViewEncapsulation } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
// tslint:disable-next-line:variable-name
/** @type {?} */
let Quill = null;
export class NgxQuillComponent {
    // used to store initial value before ViewInit
    /**
     * @param {?} elementRef
     * @param {?} domSanitizer
     * @param {?} doc
     * @param {?} platformId
     * @param {?} renderer
     * @param {?} zone
     * @param {?} config
     */
    constructor(elementRef, domSanitizer, doc, platformId, renderer, zone, config) {
        this.elementRef = elementRef;
        this.domSanitizer = domSanitizer;
        this.doc = doc;
        this.platformId = platformId;
        this.renderer = renderer;
        this.zone = zone;
        this.config = config;
        this.emptyArray = [];
        this.format = 'html';
        this.theme = 'snow';
        // tslint:disable-next-line:ban-types
        this.modules = null;
        this.readOnly = false;
        this.placeholder = 'Insert text here ...';
        this.maxLength = null;
        this.minLength = null;
        this.required = false;
        this.formats = null;
        this.sanitize = false;
        this.style = null;
        this.strict = true;
        this.scrollingContainer = null;
        this.customOptions = [];
        this.onEditorCreated = new EventEmitter();
        this.onContentChanged = new EventEmitter();
        this.onSelectionChanged = new EventEmitter();
        this.disabled = false; // used to store initial value before ViewInit
        this.valueGetter = (quillEditor, editorElement) => {
            /** @type {?} */
            let html = editorElement.children[0].innerHTML;
            if (html === '<p><br></p>' || html === '<div><br><div>') {
                html = null;
            }
            /** @type {?} */
            let modelValue = html;
            if (this.format === 'text') {
                modelValue = quillEditor.getText();
            }
            else if (this.format === 'object') {
                modelValue = quillEditor.getContents();
            }
            else if (this.format === 'json') {
                try {
                    modelValue = JSON.stringify(quillEditor.getContents());
                }
                catch (e) {
                    modelValue = quillEditor.getText();
                }
            }
            return modelValue;
        };
        this.valueSetter = (quillEditor, value) => {
            if (this.format === 'html') {
                if (this.sanitize) {
                    value = this.domSanitizer.sanitize(SecurityContext.HTML, value);
                }
                return quillEditor.clipboard.convert(value);
            }
            else if (this.format === 'json') {
                try {
                    return JSON.parse(value);
                }
                catch (e) {
                    return [{ insert: value }];
                }
            }
            return;
        };
        this.defaultModules = this.config && this.config.modules || {};
        this.bounds = this.doc.body;
        this.elementRef.nativeElement.insertAdjacentHTML('beforeend', '<div quill-editor-element></div>');
        this.editorElem = this.elementRef.nativeElement.querySelector('[quill-editor-element]');
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (isPlatformServer(this.platformId)) {
            return;
        }
        if (!Quill) {
            Quill = require('quill');
        }
        /** @type {?} */
        const toolbarElem = this.elementRef.nativeElement.querySelector('[quill-editor-toolbar]');
        /** @type {?} */
        const modules = this.modules || this.defaultModules;
        /** @type {?} */
        let placeholder = this.placeholder;
        if (this.placeholder !== null && this.placeholder !== undefined) {
            placeholder = this.placeholder.trim();
        }
        if (toolbarElem) {
            // tslint:disable-next-line:no-string-literal
            modules['toolbar'] = toolbarElem;
        }
        if (this.style) {
            Object.keys(this.style).forEach((key) => {
                this.renderer.setStyle(this.editorElem, key, this.style[key]);
            });
        }
        this.customOptions.forEach((customOption) => {
            /** @type {?} */
            const newCustomOption = Quill.import(customOption.import);
            newCustomOption.whitelist = customOption.whitelist;
            Quill.register(newCustomOption, true);
        });
        this.quillEditor = new Quill(this.editorElem, {
            bounds: this.bounds ? (this.bounds === 'self' ? this.editorElem : this.bounds) : this.doc.body,
            formats: this.formats,
            modules,
            placeholder,
            readOnly: this.readOnly,
            scrollingContainer: this.scrollingContainer,
            strict: this.strict,
            theme: this.theme || 'snow'
        });
        if (this.content) {
            if (this.format === 'object') {
                this.quillEditor.setContents(this.content, 'silent');
            }
            else if (this.format === 'text') {
                this.quillEditor.setText(this.content, 'silent');
            }
            else if (this.format === 'json') {
                try {
                    this.quillEditor.setContents(JSON.parse(this.content), 'silent');
                }
                catch (e) {
                    this.quillEditor.setText(this.content, 'silent');
                }
            }
            else {
                if (this.sanitize) {
                    this.content = this.domSanitizer.sanitize(SecurityContext.HTML, this.content);
                }
                /** @type {?} */
                const contents = this.quillEditor.clipboard.convert(this.content);
                this.quillEditor.setContents(contents, 'silent');
            }
            this.quillEditor.history.clear();
        }
        // initialize disabled status based on this.disabled as default value
        this.setDisabledState();
        this.onEditorCreated.emit(this.quillEditor);
        // mark model as touched if editor lost focus
        this.selectionChangeEvent = this.quillEditor.on('selection-change', (range, oldRange, source) => {
            this.zone.run(() => {
                this.onSelectionChanged.emit({
                    editor: this.quillEditor,
                    oldRange,
                    range,
                    source
                });
                if (!range && this.onModelTouched) {
                    this.onModelTouched();
                }
            });
        });
        // update model if text changes
        this.textChangeEvent = this.quillEditor.on('text-change', (delta, oldDelta, source) => {
            // only emit changes emitted by user interactions
            // only emit changes emitted by user interactions
            /** @type {?} */
            const text = this.quillEditor.getText();
            /** @type {?} */
            const content = this.quillEditor.getContents();
            /** @type {?} */
            let html = this.editorElem.children[0].innerHTML;
            if (html === '<p><br></p>' || html === '<div><br><div>') {
                html = null;
            }
            this.zone.run(() => {
                if (source === 'user' && this.onModelChange) {
                    this.onModelChange(this.valueGetter(this.quillEditor, this.editorElem));
                }
                this.onContentChanged.emit({
                    content,
                    delta,
                    editor: this.quillEditor,
                    html,
                    oldDelta,
                    source,
                    text
                });
            });
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.selectionChangeEvent) {
            this.selectionChangeEvent.removeListener('selection-change');
        }
        if (this.textChangeEvent) {
            this.textChangeEvent.removeListener('text-change');
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (!this.quillEditor) {
            return;
        }
        // tslint:disable:no-string-literal
        if (changes['readOnly']) {
            this.quillEditor.enable(!changes['readOnly'].currentValue);
        }
        if (changes['placeholder']) {
            this.quillEditor.root.dataset.placeholder =
                changes['placeholder'].currentValue;
        }
        if (changes['style']) {
            /** @type {?} */
            const currentStyling = changes['style'].currentValue;
            /** @type {?} */
            const previousStyling = changes['style'].previousValue;
            if (previousStyling) {
                Object.keys(previousStyling).forEach((key) => {
                    this.renderer.removeStyle(this.editorElem, key);
                });
            }
            if (currentStyling) {
                Object.keys(currentStyling).forEach((key) => {
                    this.renderer.setStyle(this.editorElem, key, this.style[key]);
                });
            }
        }
        // tslint:enable:no-string-literal
    }
    /**
     * @param {?} currentValue
     * @return {?}
     */
    writeValue(currentValue) {
        this.content = currentValue;
        if (this.quillEditor) {
            if (currentValue) {
                if (this.format === 'text') {
                    this.quillEditor.setText(currentValue);
                }
                else {
                    this.quillEditor.setContents(this.valueSetter(this.quillEditor, this.content));
                }
                return;
            }
            this.quillEditor.setText('');
        }
    }
    /**
     * @param {?=} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled = this.disabled) {
        // store initial value to set appropriate disabled status after ViewInit
        this.disabled = isDisabled;
        if (this.quillEditor) {
            if (isDisabled) {
                this.quillEditor.disable();
                this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'disabled');
            }
            else {
                if (!this.readOnly) {
                    this.quillEditor.enable();
                }
                this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
            }
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    /**
     * @return {?}
     */
    validate() {
        if (!this.quillEditor) {
            return null;
        }
        /** @type {?} */
        const err = {};
        /** @type {?} */
        let valid = true;
        /** @type {?} */
        const textLength = this.quillEditor.getText().trim().length;
        if (this.minLength && textLength && textLength < this.minLength) {
            err.minLengthError = {
                given: textLength,
                minLength: this.minLength
            };
            valid = false;
        }
        if (this.maxLength && textLength > this.maxLength) {
            err.maxLengthError = {
                given: textLength,
                maxLength: this.maxLength
            };
            valid = false;
        }
        if (this.required && !textLength) {
            err.requiredError = {
                empty: true
            };
            valid = false;
        }
        return valid ? null : err;
    }
}
NgxQuillComponent.decorators = [
    { type: Component, args: [{
                selector: 'w-ngx-quill',
                template: `
    <ng-content select="[quill-editor-toolbar]"></ng-content>
  `,
                styles: [],
                encapsulation: ViewEncapsulation.None,
                providers: [
                    {
                        multi: true,
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NgxQuillComponent)
                    },
                    {
                        multi: true,
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(() => NgxQuillComponent)
                    }
                ],
            },] },
];
/** @nocollapse */
NgxQuillComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: DomSanitizer },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: Renderer2 },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Inject, args: ['config',] }] }
];
NgxQuillComponent.propDecorators = {
    format: [{ type: Input }],
    theme: [{ type: Input }],
    modules: [{ type: Input }],
    readOnly: [{ type: Input }],
    placeholder: [{ type: Input }],
    maxLength: [{ type: Input }],
    minLength: [{ type: Input }],
    required: [{ type: Input }],
    formats: [{ type: Input }],
    sanitize: [{ type: Input }],
    style: [{ type: Input }],
    strict: [{ type: Input }],
    scrollingContainer: [{ type: Input }],
    bounds: [{ type: Input }],
    customOptions: [{ type: Input }],
    onEditorCreated: [{ type: Output }],
    onContentChanged: [{ type: Output }],
    onSelectionChanged: [{ type: Output }],
    valueGetter: [{ type: Input }],
    valueSetter: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    NgxQuillComponent.prototype.quillEditor;
    /** @type {?} */
    NgxQuillComponent.prototype.editorElem;
    /** @type {?} */
    NgxQuillComponent.prototype.emptyArray;
    /** @type {?} */
    NgxQuillComponent.prototype.content;
    /** @type {?} */
    NgxQuillComponent.prototype.selectionChangeEvent;
    /** @type {?} */
    NgxQuillComponent.prototype.textChangeEvent;
    /** @type {?} */
    NgxQuillComponent.prototype.defaultModules;
    /** @type {?} */
    NgxQuillComponent.prototype.onModelChange;
    /** @type {?} */
    NgxQuillComponent.prototype.onModelTouched;
    /** @type {?} */
    NgxQuillComponent.prototype.format;
    /** @type {?} */
    NgxQuillComponent.prototype.theme;
    /** @type {?} */
    NgxQuillComponent.prototype.modules;
    /** @type {?} */
    NgxQuillComponent.prototype.readOnly;
    /** @type {?} */
    NgxQuillComponent.prototype.placeholder;
    /** @type {?} */
    NgxQuillComponent.prototype.maxLength;
    /** @type {?} */
    NgxQuillComponent.prototype.minLength;
    /** @type {?} */
    NgxQuillComponent.prototype.required;
    /** @type {?} */
    NgxQuillComponent.prototype.formats;
    /** @type {?} */
    NgxQuillComponent.prototype.sanitize;
    /** @type {?} */
    NgxQuillComponent.prototype.style;
    /** @type {?} */
    NgxQuillComponent.prototype.strict;
    /** @type {?} */
    NgxQuillComponent.prototype.scrollingContainer;
    /** @type {?} */
    NgxQuillComponent.prototype.bounds;
    /** @type {?} */
    NgxQuillComponent.prototype.customOptions;
    /** @type {?} */
    NgxQuillComponent.prototype.onEditorCreated;
    /** @type {?} */
    NgxQuillComponent.prototype.onContentChanged;
    /** @type {?} */
    NgxQuillComponent.prototype.onSelectionChanged;
    /**
     * @type {?}
     * @private
     */
    NgxQuillComponent.prototype.disabled;
    /** @type {?} */
    NgxQuillComponent.prototype.valueGetter;
    /** @type {?} */
    NgxQuillComponent.prototype.valueSetter;
    /**
     * @type {?}
     * @private
     */
    NgxQuillComponent.prototype.elementRef;
    /**
     * @type {?}
     * @private
     */
    NgxQuillComponent.prototype.domSanitizer;
    /**
     * @type {?}
     * @private
     */
    NgxQuillComponent.prototype.doc;
    /**
     * @type {?}
     * @private
     */
    NgxQuillComponent.prototype.platformId;
    /**
     * @type {?}
     * @private
     */
    NgxQuillComponent.prototype.renderer;
    /**
     * @type {?}
     * @private
     */
    NgxQuillComponent.prototype.zone;
    /**
     * @type {?}
     * @private
     */
    NgxQuillComponent.prototype.config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXF1aWxsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0B3dGhhcHBzL25neC1xdWlsbC8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtcXVpbGwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFekQsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFHTixNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxlQUFlLEVBRWYsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFFTCxhQUFhLEVBQ2IsaUJBQWlCLEVBRWxCLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7SUFTdkMsS0FBSyxHQUFRLElBQUk7QUEwQnJCLE1BQU0sT0FBTyxpQkFBaUI7Ozs7Ozs7Ozs7O0lBcUM1QixZQUNVLFVBQXNCLEVBQ3RCLFlBQTBCLEVBQ1IsR0FBUSxFQUVMLFVBQWtCLEVBQ3ZDLFFBQW1CLEVBQ25CLElBQVksRUFDTSxNQUFzQjtRQVB4QyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQ1IsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUVMLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDdkMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ00sV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUF4Q2xELGVBQVUsR0FBVSxFQUFFLENBQUM7UUFTZCxXQUFNLEdBQXdDLE1BQU0sQ0FBQztRQUNyRCxVQUFLLEdBQUcsTUFBTSxDQUFDOztRQUVmLFlBQU8sR0FBdUMsSUFBSSxDQUFDO1FBQ25ELGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsZ0JBQVcsR0FBRyxzQkFBc0IsQ0FBQztRQUNyQyxjQUFTLEdBQWtCLElBQUksQ0FBQztRQUNoQyxjQUFTLEdBQWtCLElBQUksQ0FBQztRQUNoQyxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLFlBQU8sR0FBb0IsSUFBSSxDQUFDO1FBQ2hDLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsVUFBSyxHQUFRLElBQUksQ0FBQztRQUNsQixXQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2QsdUJBQWtCLEdBQWdDLElBQUksQ0FBQztRQUV2RCxrQkFBYSxHQUFtQixFQUFFLENBQUM7UUFFbEMsb0JBQWUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN4RCxxQkFBZ0IsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN6RCx1QkFBa0IsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUU3RCxhQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsOENBQThDO1FBd0J4RSxnQkFBVyxHQUFHLENBQUMsV0FBZ0IsRUFBRSxhQUEwQixFQUFPLEVBQUU7O2dCQUM5RCxJQUFJLEdBQWtCLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUM3RCxJQUFJLElBQUksS0FBSyxhQUFhLElBQUksSUFBSSxLQUFLLGdCQUFnQixFQUFFO2dCQUN2RCxJQUFJLEdBQUcsSUFBSSxDQUFDO2FBQ2I7O2dCQUNHLFVBQVUsR0FBRyxJQUFJO1lBRXJCLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7Z0JBQzFCLFVBQVUsR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDcEM7aUJBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtnQkFDbkMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUN4QztpQkFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFO2dCQUNqQyxJQUFJO29CQUNGLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO2lCQUN4RDtnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDVixVQUFVLEdBQUcsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUNwQzthQUNGO1lBRUQsT0FBTyxVQUFVLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBR0QsZ0JBQVcsR0FBRyxDQUFDLFdBQWdCLEVBQUUsS0FBVSxFQUFPLEVBQUU7WUFDbEQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtnQkFDMUIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNqQixLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDakU7Z0JBQ0QsT0FBTyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM3QztpQkFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFO2dCQUNqQyxJQUFJO29CQUNGLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDMUI7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1YsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7aUJBQzVCO2FBQ0Y7WUFFRCxPQUFRO1FBQ1YsQ0FBQyxDQUFDO1FBbERBLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUE7UUFDOUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQTtRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FDOUMsV0FBVyxFQUNYLGtDQUFrQyxDQUNuQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQzNELHdCQUF3QixDQUN6QixDQUFDO0lBQ0osQ0FBQzs7OztJQTJDRCxlQUFlO1FBQ2IsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDckMsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDMUI7O2NBRUssV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FDN0Qsd0JBQXdCLENBQ3pCOztjQUNLLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjOztZQUMvQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVc7UUFFbEMsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUMvRCxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN2QztRQUVELElBQUksV0FBVyxFQUFFO1lBQ2YsNkNBQTZDO1lBQzdDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxXQUFXLENBQUM7U0FDbEM7UUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFXLEVBQUUsRUFBRTtnQkFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFOztrQkFDcEMsZUFBZSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztZQUN6RCxlQUFlLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUE7WUFDbEQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDNUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJO1lBQzlGLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixPQUFPO1lBQ1AsV0FBVztZQUNYLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixrQkFBa0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCO1lBQzNDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssSUFBSSxNQUFNO1NBQzVCLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFO2dCQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQ3REO2lCQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDbEQ7aUJBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtnQkFDakMsSUFBSTtvQkFDRixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDbEU7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDbEQ7YUFDRjtpQkFBTTtnQkFDTCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQy9FOztzQkFDSyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ2pFLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUNsRDtZQUVELElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2xDO1FBRUQscUVBQXFFO1FBQ3JFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1FBRXZCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU1Qyw2Q0FBNkM7UUFDN0MsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUM3QyxrQkFBa0IsRUFDbEIsQ0FBQyxLQUFVLEVBQUUsUUFBYSxFQUFFLE1BQWMsRUFBRSxFQUFFO1lBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtnQkFDakIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQztvQkFDM0IsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXO29CQUN4QixRQUFRO29CQUNSLEtBQUs7b0JBQ0wsTUFBTTtpQkFDUCxDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUNqQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7aUJBQ3ZCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQ0YsQ0FBQztRQUVGLCtCQUErQjtRQUMvQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUN4QyxhQUFhLEVBQ2IsQ0FBQyxLQUFVLEVBQUUsUUFBYSxFQUFFLE1BQWMsRUFBUSxFQUFFO1lBQ2xELGlEQUFpRDs7O2tCQUUzQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7O2tCQUNqQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUU7O2dCQUUxQyxJQUFJLEdBQWtCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDL0QsSUFBSSxJQUFJLEtBQUssYUFBYSxJQUFJLElBQUksS0FBSyxnQkFBZ0IsRUFBRTtnQkFDdkQsSUFBSSxHQUFHLElBQUksQ0FBQzthQUNiO1lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO2dCQUNqQixJQUFJLE1BQU0sS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDM0MsSUFBSSxDQUFDLGFBQWEsQ0FDaEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FDcEQsQ0FBQztpQkFDSDtnQkFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO29CQUN6QixPQUFPO29CQUNQLEtBQUs7b0JBQ0wsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXO29CQUN4QixJQUFJO29CQUNKLFFBQVE7b0JBQ1IsTUFBTTtvQkFDTixJQUFJO2lCQUNMLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUNGLENBQUM7SUFDSixDQUFDOzs7O0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzdCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUM5RDtRQUNELElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN4QixJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNwRDtJQUNILENBQUM7Ozs7O0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3JCLE9BQU87U0FDUjtRQUNELG1DQUFtQztRQUNuQyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUM1RDtRQUNELElBQUksT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQzFCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2dCQUN2QyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsWUFBWSxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7O2tCQUNkLGNBQWMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWTs7a0JBQzlDLGVBQWUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYTtZQUV0RCxJQUFJLGVBQWUsRUFBRTtnQkFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFXLEVBQUUsRUFBRTtvQkFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbEQsQ0FBQyxDQUFDLENBQUM7YUFDSjtZQUNELElBQUksY0FBYyxFQUFFO2dCQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQVcsRUFBRSxFQUFFO29CQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hFLENBQUMsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtRQUNELGtDQUFrQztJQUNwQyxDQUFDOzs7OztJQUVELFVBQVUsQ0FBQyxZQUFpQjtRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQTtRQUUzQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxZQUFZLEVBQUU7Z0JBQ2hCLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7b0JBQzFCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUN4QztxQkFBTTtvQkFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FDMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FDakQsQ0FBQztpQkFDSDtnQkFDRCxPQUFPO2FBQ1I7WUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUM7Ozs7O0lBRUQsZ0JBQWdCLENBQUMsYUFBc0IsSUFBSSxDQUFDLFFBQVE7UUFDbEQsd0VBQXdFO1FBQ3hFLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFBO1FBQzFCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixJQUFJLFVBQVUsRUFBRTtnQkFDZCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO2dCQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7YUFDbkY7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ2xCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQzNCO2dCQUNELElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2FBQzFFO1NBQ0Y7SUFDSCxDQUFDOzs7OztJQUVELGdCQUFnQixDQUFDLEVBQU87UUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDMUIsQ0FBQzs7Ozs7SUFFRCxpQkFBaUIsQ0FBQyxFQUFPO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7Ozs7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsT0FBTyxJQUFJLENBQUM7U0FDYjs7Y0FFSyxHQUFHLEdBVUwsRUFBRTs7WUFDRixLQUFLLEdBQUcsSUFBSTs7Y0FFVixVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNO1FBRTNELElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxVQUFVLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDL0QsR0FBRyxDQUFDLGNBQWMsR0FBRztnQkFDbkIsS0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUzthQUMxQixDQUFBO1lBRUQsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUNmO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2pELEdBQUcsQ0FBQyxjQUFjLEdBQUc7Z0JBQ25CLEtBQUssRUFBRSxVQUFVO2dCQUNqQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7YUFDMUIsQ0FBQTtZQUVELEtBQUssR0FBRyxLQUFLLENBQUM7U0FDZjtRQUVELElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNoQyxHQUFHLENBQUMsYUFBYSxHQUFHO2dCQUNsQixLQUFLLEVBQUUsSUFBSTthQUNaLENBQUE7WUFFRCxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ2Y7UUFFRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDNUIsQ0FBQzs7O1lBeFhGLFNBQVMsU0FBQztnQkFFVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsUUFBUSxFQUFFOztHQUVUO2dCQUNELE1BQU0sRUFBRSxFQUFFO2dCQUNWLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsS0FBSyxFQUFFLElBQUk7d0JBQ1gsT0FBTyxFQUFFLGlCQUFpQjt3QkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztxQkFDakQ7b0JBQ0Q7d0JBQ0UsS0FBSyxFQUFFLElBQUk7d0JBQ1gsT0FBTyxFQUFFLGFBQWE7d0JBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUM7cUJBQ2pEO2lCQUNGO2FBQ0Y7Ozs7WUF4REMsVUFBVTtZQUxILFlBQVk7NENBdUdoQixNQUFNLFNBQUMsUUFBUTtZQUV5QixNQUFNLHVCQUE5QyxNQUFNLFNBQUMsV0FBVztZQTFGckIsU0FBUztZQUxULE1BQU07NENBa0dILE1BQU0sU0FBQyxRQUFROzs7cUJBL0JqQixLQUFLO29CQUNMLEtBQUs7c0JBRUwsS0FBSzt1QkFDTCxLQUFLOzBCQUNMLEtBQUs7d0JBQ0wsS0FBSzt3QkFDTCxLQUFLO3VCQUNMLEtBQUs7c0JBQ0wsS0FBSzt1QkFDTCxLQUFLO29CQUNMLEtBQUs7cUJBQ0wsS0FBSztpQ0FDTCxLQUFLO3FCQUNMLEtBQUs7NEJBQ0wsS0FBSzs4QkFFTCxNQUFNOytCQUNOLE1BQU07aUNBQ04sTUFBTTswQkF5Qk4sS0FBSzswQkF1QkwsS0FBSzs7OztJQTlFTix3Q0FBaUI7O0lBQ2pCLHVDQUF3Qjs7SUFDeEIsdUNBQXVCOztJQUN2QixvQ0FBYTs7SUFDYixpREFBMEI7O0lBQzFCLDRDQUFxQjs7SUFDckIsMkNBQXFDOztJQUVyQywwQ0FBbUI7O0lBQ25CLDJDQUFvQjs7SUFFcEIsbUNBQThEOztJQUM5RCxrQ0FBd0I7O0lBRXhCLG9DQUE0RDs7SUFDNUQscUNBQTBCOztJQUMxQix3Q0FBOEM7O0lBQzlDLHNDQUF5Qzs7SUFDekMsc0NBQXlDOztJQUN6QyxxQ0FBMEI7O0lBQzFCLG9DQUF5Qzs7SUFDekMscUNBQTBCOztJQUMxQixrQ0FBMkI7O0lBQzNCLG1DQUF1Qjs7SUFDdkIsK0NBQWdFOztJQUNoRSxtQ0FBc0M7O0lBQ3RDLDBDQUE0Qzs7SUFFNUMsNENBQWtFOztJQUNsRSw2Q0FBbUU7O0lBQ25FLCtDQUFxRTs7Ozs7SUFFckUscUNBQXlCOztJQXVCekIsd0NBcUJDOztJQUVELHdDQWdCRTs7Ozs7SUEzREEsdUNBQThCOzs7OztJQUM5Qix5Q0FBa0M7Ozs7O0lBQ2xDLGdDQUFrQzs7Ozs7SUFFbEMsdUNBQStDOzs7OztJQUMvQyxxQ0FBMkI7Ozs7O0lBQzNCLGlDQUFvQjs7Ozs7SUFDcEIsbUNBQWdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNQbGF0Zm9ybVNlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUExBVEZPUk1fSUQsXG4gIFJlbmRlcmVyMixcbiAgU2VjdXJpdHlDb250ZXh0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIE5HX1ZBTElEQVRPUlMsXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBWYWxpZGF0b3Jcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDdXN0b21PcHRpb24sIE5neFF1aWxsQ29uZmlnLCBOZ3hRdWlsbE1vZHVsZXMgfSBmcm9tICcuL25neC1xdWlsbC5pbnRlcmZhY2VzJztcblxuXG4vLyBpbXBvcnQgKiBhcyBRdWlsbE5hbWVzcGFjZSBmcm9tICdxdWlsbCdcbi8vIEJlY2F1c2UgcXVpbGwgdXNlcyBgZG9jdW1lbnRgIGRpcmVjdGx5LCB3ZSBjYW5ub3QgYGltcG9ydGAgZHVyaW5nIFNTUlxuLy8gaW5zdGVhZCwgd2UgbG9hZCBkeW5hbWljYWxseSB2aWEgYHJlcXVpcmUoJ3F1aWxsJylgIGluIGBuZ0FmdGVyVmlld0luaXQoKWBcbmRlY2xhcmUgdmFyIHJlcXVpcmU6IGFueTtcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG5sZXQgUXVpbGw6IGFueSA9IG51bGw7XG5cblxuXG5AQ29tcG9uZW50KHtcblxuICBzZWxlY3RvcjogJ3ctbmd4LXF1aWxsJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbcXVpbGwtZWRpdG9yLXRvb2xiYXJdXCI+PC9uZy1jb250ZW50PlxuICBgLFxuICBzdHlsZXM6IFtdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmd4UXVpbGxDb21wb25lbnQpXG4gICAgfSxcbiAgICB7XG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ3hRdWlsbENvbXBvbmVudClcbiAgICB9XG4gIF0sXG59KVxuXG5leHBvcnQgY2xhc3MgTmd4UXVpbGxDb21wb25lbnRcbiAgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIFZhbGlkYXRvciB7XG5cbiAgcXVpbGxFZGl0b3I6IGFueTtcbiAgZWRpdG9yRWxlbTogSFRNTEVsZW1lbnQ7XG4gIGVtcHR5QXJyYXk6IGFueVtdID0gW107XG4gIGNvbnRlbnQ6IGFueTtcbiAgc2VsZWN0aW9uQ2hhbmdlRXZlbnQ6IGFueTtcbiAgdGV4dENoYW5nZUV2ZW50OiBhbnk7XG4gIGRlZmF1bHRNb2R1bGVzOiBOZ3hRdWlsbE1vZHVsZXMgfCB7fTtcblxuICBvbk1vZGVsQ2hhbmdlOiBhbnk7XG4gIG9uTW9kZWxUb3VjaGVkOiBhbnk7XG5cbiAgQElucHV0KCkgZm9ybWF0OiAnb2JqZWN0JyB8ICdodG1sJyB8ICd0ZXh0JyB8ICdqc29uJyA9ICdodG1sJztcbiAgQElucHV0KCkgdGhlbWUgPSAnc25vdyc7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpiYW4tdHlwZXNcbiAgQElucHV0KCkgbW9kdWxlczogeyBbaW5kZXg6IHN0cmluZ106IE9iamVjdCB9IHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIHJlYWRPbmx5ID0gZmFsc2U7XG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyID0gJ0luc2VydCB0ZXh0IGhlcmUgLi4uJztcbiAgQElucHV0KCkgbWF4TGVuZ3RoOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbWluTGVuZ3RoOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgcmVxdWlyZWQgPSBmYWxzZTtcbiAgQElucHV0KCkgZm9ybWF0czogc3RyaW5nW10gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgc2FuaXRpemUgPSBmYWxzZTtcbiAgQElucHV0KCkgc3R5bGU6IGFueSA9IG51bGw7XG4gIEBJbnB1dCgpIHN0cmljdCA9IHRydWU7XG4gIEBJbnB1dCgpIHNjcm9sbGluZ0NvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgYm91bmRzOiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgQElucHV0KCkgY3VzdG9tT3B0aW9uczogQ3VzdG9tT3B0aW9uW10gPSBbXTtcblxuICBAT3V0cHV0KCkgb25FZGl0b3JDcmVhdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uQ29udGVudENoYW5nZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25TZWxlY3Rpb25DaGFuZ2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIGRpc2FibGVkID0gZmFsc2U7IC8vIHVzZWQgdG8gc3RvcmUgaW5pdGlhbCB2YWx1ZSBiZWZvcmUgVmlld0luaXRcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvYzogYW55LFxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpiYW4tdHlwZXNcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUsXG4gICAgQEluamVjdCgnY29uZmlnJykgcHJpdmF0ZSBjb25maWc6IE5neFF1aWxsQ29uZmlnXG4gICkge1xuICAgIHRoaXMuZGVmYXVsdE1vZHVsZXMgPSB0aGlzLmNvbmZpZyAmJiB0aGlzLmNvbmZpZy5tb2R1bGVzIHx8IHt9XG4gICAgdGhpcy5ib3VuZHMgPSB0aGlzLmRvYy5ib2R5XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgJ2JlZm9yZWVuZCcsXG4gICAgICAnPGRpdiBxdWlsbC1lZGl0b3ItZWxlbWVudD48L2Rpdj4nXG4gICAgKTtcbiAgICB0aGlzLmVkaXRvckVsZW0gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgJ1txdWlsbC1lZGl0b3ItZWxlbWVudF0nXG4gICAgKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHZhbHVlR2V0dGVyID0gKHF1aWxsRWRpdG9yOiBhbnksIGVkaXRvckVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYW55ID0+IHtcbiAgICBsZXQgaHRtbDogc3RyaW5nIHwgbnVsbCA9IGVkaXRvckVsZW1lbnQuY2hpbGRyZW5bMF0uaW5uZXJIVE1MXG4gICAgaWYgKGh0bWwgPT09ICc8cD48YnI+PC9wPicgfHwgaHRtbCA9PT0gJzxkaXY+PGJyPjxkaXY+Jykge1xuICAgICAgaHRtbCA9IG51bGw7XG4gICAgfVxuICAgIGxldCBtb2RlbFZhbHVlID0gaHRtbFxuXG4gICAgaWYgKHRoaXMuZm9ybWF0ID09PSAndGV4dCcpIHtcbiAgICAgIG1vZGVsVmFsdWUgPSBxdWlsbEVkaXRvci5nZXRUZXh0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZvcm1hdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG1vZGVsVmFsdWUgPSBxdWlsbEVkaXRvci5nZXRDb250ZW50cygpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mb3JtYXQgPT09ICdqc29uJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbW9kZWxWYWx1ZSA9IEpTT04uc3RyaW5naWZ5KHF1aWxsRWRpdG9yLmdldENvbnRlbnRzKCkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBtb2RlbFZhbHVlID0gcXVpbGxFZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2RlbFZhbHVlO1xuICB9XG5cbiAgQElucHV0KClcbiAgdmFsdWVTZXR0ZXIgPSAocXVpbGxFZGl0b3I6IGFueSwgdmFsdWU6IGFueSk6IGFueSA9PiB7XG4gICAgaWYgKHRoaXMuZm9ybWF0ID09PSAnaHRtbCcpIHtcbiAgICAgIGlmICh0aGlzLnNhbml0aXplKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5kb21TYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBxdWlsbEVkaXRvci5jbGlwYm9hcmQuY29udmVydCh2YWx1ZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZvcm1hdCA9PT0gJ2pzb24nKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBbeyBpbnNlcnQ6IHZhbHVlIH1dO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiA7XG4gIH07XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFRdWlsbCkge1xuICAgICAgUXVpbGwgPSByZXF1aXJlKCdxdWlsbCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHRvb2xiYXJFbGVtID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICdbcXVpbGwtZWRpdG9yLXRvb2xiYXJdJ1xuICAgICk7XG4gICAgY29uc3QgbW9kdWxlcyA9IHRoaXMubW9kdWxlcyB8fCB0aGlzLmRlZmF1bHRNb2R1bGVzXG4gICAgbGV0IHBsYWNlaG9sZGVyID0gdGhpcy5wbGFjZWhvbGRlclxuXG4gICAgaWYgKHRoaXMucGxhY2Vob2xkZXIgIT09IG51bGwgJiYgdGhpcy5wbGFjZWhvbGRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwbGFjZWhvbGRlciA9IHRoaXMucGxhY2Vob2xkZXIudHJpbSgpO1xuICAgIH1cblxuICAgIGlmICh0b29sYmFyRWxlbSkge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXN0cmluZy1saXRlcmFsXG4gICAgICBtb2R1bGVzWyd0b29sYmFyJ10gPSB0b29sYmFyRWxlbTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdHlsZSkge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5zdHlsZSkuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVkaXRvckVsZW0sIGtleSwgdGhpcy5zdHlsZVtrZXldKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuY3VzdG9tT3B0aW9ucy5mb3JFYWNoKChjdXN0b21PcHRpb24pID0+IHtcbiAgICAgIGNvbnN0IG5ld0N1c3RvbU9wdGlvbiA9IFF1aWxsLmltcG9ydChjdXN0b21PcHRpb24uaW1wb3J0KVxuICAgICAgbmV3Q3VzdG9tT3B0aW9uLndoaXRlbGlzdCA9IGN1c3RvbU9wdGlvbi53aGl0ZWxpc3RcbiAgICAgIFF1aWxsLnJlZ2lzdGVyKG5ld0N1c3RvbU9wdGlvbiwgdHJ1ZSk7XG4gICAgfSlcblxuICAgIHRoaXMucXVpbGxFZGl0b3IgPSBuZXcgUXVpbGwodGhpcy5lZGl0b3JFbGVtLCB7XG4gICAgICBib3VuZHM6IHRoaXMuYm91bmRzID8gKHRoaXMuYm91bmRzID09PSAnc2VsZicgPyB0aGlzLmVkaXRvckVsZW0gOiB0aGlzLmJvdW5kcykgOiB0aGlzLmRvYy5ib2R5LFxuICAgICAgZm9ybWF0czogdGhpcy5mb3JtYXRzLFxuICAgICAgbW9kdWxlcyxcbiAgICAgIHBsYWNlaG9sZGVyLFxuICAgICAgcmVhZE9ubHk6IHRoaXMucmVhZE9ubHksXG4gICAgICBzY3JvbGxpbmdDb250YWluZXI6IHRoaXMuc2Nyb2xsaW5nQ29udGFpbmVyLFxuICAgICAgc3RyaWN0OiB0aGlzLnN0cmljdCxcbiAgICAgIHRoZW1lOiB0aGlzLnRoZW1lIHx8ICdzbm93J1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgaWYgKHRoaXMuZm9ybWF0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldENvbnRlbnRzKHRoaXMuY29udGVudCwgJ3NpbGVudCcpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmZvcm1hdCA9PT0gJ3RleHQnKSB7XG4gICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0VGV4dCh0aGlzLmNvbnRlbnQsICdzaWxlbnQnKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mb3JtYXQgPT09ICdqc29uJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0Q29udGVudHMoSlNPTi5wYXJzZSh0aGlzLmNvbnRlbnQpLCAnc2lsZW50Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldFRleHQodGhpcy5jb250ZW50LCAnc2lsZW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnNhbml0aXplKSB7XG4gICAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5kb21TYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIHRoaXMuY29udGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29udGVudHMgPSB0aGlzLnF1aWxsRWRpdG9yLmNsaXBib2FyZC5jb252ZXJ0KHRoaXMuY29udGVudClcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRDb250ZW50cyhjb250ZW50cywgJ3NpbGVudCcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnF1aWxsRWRpdG9yLmhpc3RvcnkuY2xlYXIoKTtcbiAgICB9XG5cbiAgICAvLyBpbml0aWFsaXplIGRpc2FibGVkIHN0YXR1cyBiYXNlZCBvbiB0aGlzLmRpc2FibGVkIGFzIGRlZmF1bHQgdmFsdWVcbiAgICB0aGlzLnNldERpc2FibGVkU3RhdGUoKVxuXG4gICAgdGhpcy5vbkVkaXRvckNyZWF0ZWQuZW1pdCh0aGlzLnF1aWxsRWRpdG9yKTtcblxuICAgIC8vIG1hcmsgbW9kZWwgYXMgdG91Y2hlZCBpZiBlZGl0b3IgbG9zdCBmb2N1c1xuICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlRXZlbnQgPSB0aGlzLnF1aWxsRWRpdG9yLm9uKFxuICAgICAgJ3NlbGVjdGlvbi1jaGFuZ2UnLFxuICAgICAgKHJhbmdlOiBhbnksIG9sZFJhbmdlOiBhbnksIHNvdXJjZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMub25TZWxlY3Rpb25DaGFuZ2VkLmVtaXQoe1xuICAgICAgICAgICAgZWRpdG9yOiB0aGlzLnF1aWxsRWRpdG9yLFxuICAgICAgICAgICAgb2xkUmFuZ2UsXG4gICAgICAgICAgICByYW5nZSxcbiAgICAgICAgICAgIHNvdXJjZVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKCFyYW5nZSAmJiB0aGlzLm9uTW9kZWxUb3VjaGVkKSB7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gdXBkYXRlIG1vZGVsIGlmIHRleHQgY2hhbmdlc1xuICAgIHRoaXMudGV4dENoYW5nZUV2ZW50ID0gdGhpcy5xdWlsbEVkaXRvci5vbihcbiAgICAgICd0ZXh0LWNoYW5nZScsXG4gICAgICAoZGVsdGE6IGFueSwgb2xkRGVsdGE6IGFueSwgc291cmNlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgLy8gb25seSBlbWl0IGNoYW5nZXMgZW1pdHRlZCBieSB1c2VyIGludGVyYWN0aW9uc1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0Q29udGVudHMoKTtcblxuICAgICAgICBsZXQgaHRtbDogc3RyaW5nIHwgbnVsbCA9IHRoaXMuZWRpdG9yRWxlbS5jaGlsZHJlblswXS5pbm5lckhUTUw7XG4gICAgICAgIGlmIChodG1sID09PSAnPHA+PGJyPjwvcD4nIHx8IGh0bWwgPT09ICc8ZGl2Pjxicj48ZGl2PicpIHtcbiAgICAgICAgICBodG1sID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIGlmIChzb3VyY2UgPT09ICd1c2VyJyAmJiB0aGlzLm9uTW9kZWxDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZShcbiAgICAgICAgICAgICAgdGhpcy52YWx1ZUdldHRlcih0aGlzLnF1aWxsRWRpdG9yLCB0aGlzLmVkaXRvckVsZW0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMub25Db250ZW50Q2hhbmdlZC5lbWl0KHtcbiAgICAgICAgICAgIGNvbnRlbnQsXG4gICAgICAgICAgICBkZWx0YSxcbiAgICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgICAgIGh0bWwsXG4gICAgICAgICAgICBvbGREZWx0YSxcbiAgICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICAgIHRleHRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbkNoYW5nZUV2ZW50KSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZUV2ZW50LnJlbW92ZUxpc3RlbmVyKCdzZWxlY3Rpb24tY2hhbmdlJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRleHRDaGFuZ2VFdmVudCkge1xuICAgICAgdGhpcy50ZXh0Q2hhbmdlRXZlbnQucmVtb3ZlTGlzdGVuZXIoJ3RleHQtY2hhbmdlJyk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpuby1zdHJpbmctbGl0ZXJhbFxuICAgIGlmIChjaGFuZ2VzWydyZWFkT25seSddKSB7XG4gICAgICB0aGlzLnF1aWxsRWRpdG9yLmVuYWJsZSghY2hhbmdlc1sncmVhZE9ubHknXS5jdXJyZW50VmFsdWUpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1sncGxhY2Vob2xkZXInXSkge1xuICAgICAgdGhpcy5xdWlsbEVkaXRvci5yb290LmRhdGFzZXQucGxhY2Vob2xkZXIgPVxuICAgICAgICBjaGFuZ2VzWydwbGFjZWhvbGRlciddLmN1cnJlbnRWYWx1ZTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ3N0eWxlJ10pIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRTdHlsaW5nID0gY2hhbmdlc1snc3R5bGUnXS5jdXJyZW50VmFsdWVcbiAgICAgIGNvbnN0IHByZXZpb3VzU3R5bGluZyA9IGNoYW5nZXNbJ3N0eWxlJ10ucHJldmlvdXNWYWx1ZVxuXG4gICAgICBpZiAocHJldmlvdXNTdHlsaW5nKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHByZXZpb3VzU3R5bGluZykuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZVN0eWxlKHRoaXMuZWRpdG9yRWxlbSwga2V5KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudFN0eWxpbmcpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoY3VycmVudFN0eWxpbmcpLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVkaXRvckVsZW0sIGtleSwgdGhpcy5zdHlsZVtrZXldKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHRzbGludDplbmFibGU6bm8tc3RyaW5nLWxpdGVyYWxcbiAgfVxuXG4gIHdyaXRlVmFsdWUoY3VycmVudFZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLmNvbnRlbnQgPSBjdXJyZW50VmFsdWVcblxuICAgIGlmICh0aGlzLnF1aWxsRWRpdG9yKSB7XG4gICAgICBpZiAoY3VycmVudFZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmZvcm1hdCA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRUZXh0KGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRDb250ZW50cyhcbiAgICAgICAgICAgIHRoaXMudmFsdWVTZXR0ZXIodGhpcy5xdWlsbEVkaXRvciwgdGhpcy5jb250ZW50KVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRUZXh0KCcnKTtcbiAgICB9XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4gPSB0aGlzLmRpc2FibGVkKTogdm9pZCB7XG4gICAgLy8gc3RvcmUgaW5pdGlhbCB2YWx1ZSB0byBzZXQgYXBwcm9wcmlhdGUgZGlzYWJsZWQgc3RhdHVzIGFmdGVyIFZpZXdJbml0XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWRcbiAgICBpZiAodGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgaWYgKGlzRGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5kaXNhYmxlKClcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlYWRPbmx5KSB7XG4gICAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5lbmFibGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbk1vZGVsQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgdmFsaWRhdGUoKSB7XG4gICAgaWYgKCF0aGlzLnF1aWxsRWRpdG9yKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBlcnI6IHtcbiAgICAgIG1pbkxlbmd0aEVycm9yPzoge1xuICAgICAgICBnaXZlbjogbnVtYmVyXG4gICAgICAgIG1pbkxlbmd0aDogbnVtYmVyXG4gICAgICB9XG4gICAgICBtYXhMZW5ndGhFcnJvcj86IHtcbiAgICAgICAgZ2l2ZW46IG51bWJlclxuICAgICAgICBtYXhMZW5ndGg6IG51bWJlclxuICAgICAgfVxuICAgICAgcmVxdWlyZWRFcnJvcj86IHsgZW1wdHk6IGJvb2xlYW4gfVxuICAgIH0gPSB7fVxuICAgIGxldCB2YWxpZCA9IHRydWU7XG5cbiAgICBjb25zdCB0ZXh0TGVuZ3RoID0gdGhpcy5xdWlsbEVkaXRvci5nZXRUZXh0KCkudHJpbSgpLmxlbmd0aDtcblxuICAgIGlmICh0aGlzLm1pbkxlbmd0aCAmJiB0ZXh0TGVuZ3RoICYmIHRleHRMZW5ndGggPCB0aGlzLm1pbkxlbmd0aCkge1xuICAgICAgZXJyLm1pbkxlbmd0aEVycm9yID0ge1xuICAgICAgICBnaXZlbjogdGV4dExlbmd0aCxcbiAgICAgICAgbWluTGVuZ3RoOiB0aGlzLm1pbkxlbmd0aFxuICAgICAgfVxuXG4gICAgICB2YWxpZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1heExlbmd0aCAmJiB0ZXh0TGVuZ3RoID4gdGhpcy5tYXhMZW5ndGgpIHtcbiAgICAgIGVyci5tYXhMZW5ndGhFcnJvciA9IHtcbiAgICAgICAgZ2l2ZW46IHRleHRMZW5ndGgsXG4gICAgICAgIG1heExlbmd0aDogdGhpcy5tYXhMZW5ndGhcbiAgICAgIH1cblxuICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZXF1aXJlZCAmJiAhdGV4dExlbmd0aCkge1xuICAgICAgZXJyLnJlcXVpcmVkRXJyb3IgPSB7XG4gICAgICAgIGVtcHR5OiB0cnVlXG4gICAgICB9XG5cbiAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkID8gbnVsbCA6IGVycjtcbiAgfVxuXG59XG4iXX0=