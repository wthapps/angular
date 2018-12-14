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
var Quill = null;
var NgxQuillComponent = /** @class */ (function () {
    function NgxQuillComponent(elementRef, domSanitizer, doc, platformId, renderer, zone, config) {
        var _this = this;
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
        this.valueGetter = function (quillEditor, editorElement) {
            /** @type {?} */
            var html = editorElement.children[0].innerHTML;
            if (html === '<p><br></p>' || html === '<div><br><div>') {
                html = null;
            }
            /** @type {?} */
            var modelValue = html;
            if (_this.format === 'text') {
                modelValue = quillEditor.getText();
            }
            else if (_this.format === 'object') {
                modelValue = quillEditor.getContents();
            }
            else if (_this.format === 'json') {
                try {
                    modelValue = JSON.stringify(quillEditor.getContents());
                }
                catch (e) {
                    modelValue = quillEditor.getText();
                }
            }
            return modelValue;
        };
        this.valueSetter = function (quillEditor, value) {
            if (_this.format === 'html') {
                if (_this.sanitize) {
                    value = _this.domSanitizer.sanitize(SecurityContext.HTML, value);
                }
                return quillEditor.clipboard.convert(value);
            }
            else if (_this.format === 'json') {
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
    NgxQuillComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (isPlatformServer(this.platformId)) {
            return;
        }
        if (!Quill) {
            Quill = require('quill');
        }
        /** @type {?} */
        var toolbarElem = this.elementRef.nativeElement.querySelector('[quill-editor-toolbar]');
        /** @type {?} */
        var modules = this.modules || this.defaultModules;
        /** @type {?} */
        var placeholder = this.placeholder;
        if (this.placeholder !== null && this.placeholder !== undefined) {
            placeholder = this.placeholder.trim();
        }
        if (toolbarElem) {
            // tslint:disable-next-line:no-string-literal
            modules['toolbar'] = toolbarElem;
        }
        if (this.style) {
            Object.keys(this.style).forEach(function (key) {
                _this.renderer.setStyle(_this.editorElem, key, _this.style[key]);
            });
        }
        this.customOptions.forEach(function (customOption) {
            /** @type {?} */
            var newCustomOption = Quill.import(customOption.import);
            newCustomOption.whitelist = customOption.whitelist;
            Quill.register(newCustomOption, true);
        });
        this.quillEditor = new Quill(this.editorElem, {
            bounds: this.bounds ? (this.bounds === 'self' ? this.editorElem : this.bounds) : this.doc.body,
            formats: this.formats,
            modules: modules,
            placeholder: placeholder,
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
                var contents = this.quillEditor.clipboard.convert(this.content);
                this.quillEditor.setContents(contents, 'silent');
            }
            this.quillEditor.history.clear();
        }
        // initialize disabled status based on this.disabled as default value
        this.setDisabledState();
        this.onEditorCreated.emit(this.quillEditor);
        // mark model as touched if editor lost focus
        this.selectionChangeEvent = this.quillEditor.on('selection-change', function (range, oldRange, source) {
            _this.zone.run(function () {
                _this.onSelectionChanged.emit({
                    editor: _this.quillEditor,
                    oldRange: oldRange,
                    range: range,
                    source: source
                });
                if (!range && _this.onModelTouched) {
                    _this.onModelTouched();
                }
            });
        });
        // update model if text changes
        this.textChangeEvent = this.quillEditor.on('text-change', function (delta, oldDelta, source) {
            // only emit changes emitted by user interactions
            // only emit changes emitted by user interactions
            /** @type {?} */
            var text = _this.quillEditor.getText();
            /** @type {?} */
            var content = _this.quillEditor.getContents();
            /** @type {?} */
            var html = _this.editorElem.children[0].innerHTML;
            if (html === '<p><br></p>' || html === '<div><br><div>') {
                html = null;
            }
            _this.zone.run(function () {
                if (source === 'user' && _this.onModelChange) {
                    _this.onModelChange(_this.valueGetter(_this.quillEditor, _this.editorElem));
                }
                _this.onContentChanged.emit({
                    content: content,
                    delta: delta,
                    editor: _this.quillEditor,
                    html: html,
                    oldDelta: oldDelta,
                    source: source,
                    text: text
                });
            });
        });
    };
    /**
     * @return {?}
     */
    NgxQuillComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.selectionChangeEvent) {
            this.selectionChangeEvent.removeListener('selection-change');
        }
        if (this.textChangeEvent) {
            this.textChangeEvent.removeListener('text-change');
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgxQuillComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        var _this = this;
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
            var currentStyling = changes['style'].currentValue;
            /** @type {?} */
            var previousStyling = changes['style'].previousValue;
            if (previousStyling) {
                Object.keys(previousStyling).forEach(function (key) {
                    _this.renderer.removeStyle(_this.editorElem, key);
                });
            }
            if (currentStyling) {
                Object.keys(currentStyling).forEach(function (key) {
                    _this.renderer.setStyle(_this.editorElem, key, _this.style[key]);
                });
            }
        }
        // tslint:enable:no-string-literal
    };
    /**
     * @param {?} currentValue
     * @return {?}
     */
    NgxQuillComponent.prototype.writeValue = /**
     * @param {?} currentValue
     * @return {?}
     */
    function (currentValue) {
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
    };
    /**
     * @param {?=} isDisabled
     * @return {?}
     */
    NgxQuillComponent.prototype.setDisabledState = /**
     * @param {?=} isDisabled
     * @return {?}
     */
    function (isDisabled) {
        if (isDisabled === void 0) { isDisabled = this.disabled; }
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
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgxQuillComponent.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onModelChange = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgxQuillComponent.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onModelTouched = fn;
    };
    /**
     * @return {?}
     */
    NgxQuillComponent.prototype.validate = /**
     * @return {?}
     */
    function () {
        if (!this.quillEditor) {
            return null;
        }
        /** @type {?} */
        var err = {};
        /** @type {?} */
        var valid = true;
        /** @type {?} */
        var textLength = this.quillEditor.getText().trim().length;
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
    };
    NgxQuillComponent.decorators = [
        { type: Component, args: [{
                    selector: 'w-ngx-quill',
                    template: "\n    <ng-content select=\"[quill-editor-toolbar]\"></ng-content>\n  ",
                    styles: [],
                    encapsulation: ViewEncapsulation.None,
                    providers: [
                        {
                            multi: true,
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return NgxQuillComponent; })
                        },
                        {
                            multi: true,
                            provide: NG_VALIDATORS,
                            useExisting: forwardRef(function () { return NgxQuillComponent; })
                        }
                    ],
                },] },
    ];
    /** @nocollapse */
    NgxQuillComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: DomSanitizer },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
        { type: Renderer2 },
        { type: NgZone },
        { type: undefined, decorators: [{ type: Inject, args: ['config',] }] }
    ]; };
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
    return NgxQuillComponent;
}());
export { NgxQuillComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXF1aWxsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0B3dGhhcHBzL25neC1xdWlsbC8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtcXVpbGwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFekQsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFHTixNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxlQUFlLEVBRWYsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFFTCxhQUFhLEVBQ2IsaUJBQWlCLEVBRWxCLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7SUFTdkMsS0FBSyxHQUFRLElBQUk7QUFJckI7SUEyREUsMkJBQ1UsVUFBc0IsRUFDdEIsWUFBMEIsRUFDUixHQUFRLEVBRUwsVUFBa0IsRUFDdkMsUUFBbUIsRUFDbkIsSUFBWSxFQUNNLE1BQXNCO1FBUmxELGlCQW1CQztRQWxCUyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQ1IsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUVMLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDdkMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ00sV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUF4Q2xELGVBQVUsR0FBVSxFQUFFLENBQUM7UUFTZCxXQUFNLEdBQXdDLE1BQU0sQ0FBQztRQUNyRCxVQUFLLEdBQUcsTUFBTSxDQUFDOztRQUVmLFlBQU8sR0FBdUMsSUFB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QUMsUUFBUTs7O3lCQS9CakIsS0FBSzt3QkFDTCxLQUFLOzBCQUVMLEtBQUs7MkJBQ0wsS0FBSzs4QkFDTCxLQUFLOzRCQUNMLEtBQUs7NEJBQ0wsS0FBSzsyQkFDTCxLQUFLOzBCQUNMLEtBQUs7MkJBQ0wsS0FBSzt3QkFDTCxLQUFLO3lCQUNMLEtBQUs7cUNBQ0wsS0FBSzt5QkFDTCxLQUFLO2dDQUNMLEtBQUs7a0NBRUwsTUFBTTttQ0FDTixNQUFNO3FDQUNOLE1BQU07OEJBeUJOLEtBQUs7OEJBdUJMLEtBQUs7O0lBbVJSLHdCQUFDO0NBQUEsQUExWEQsSUEwWEM7U0FwV1ksaUJBQWlCOzs7SUFHNUIsd0NBQWlCOztJQUNqQix1Q0FBd0I7O0lBQ3hCLHVDQUF1Qjs7SUFDdkIsb0NBQWE7O0lBQ2IsaURBQTBCOztJQUMxQiw0Q0FBcUI7O0lBQ3JCLDJDQUFxQzs7SUFFckMsMENBQW1COztJQUNuQiwyQ0FBb0I7O0lBRXBCLG1DQUE4RDs7SUFDOUQsa0NBQXdCOztJQUV4QixvQ0FBNEQ7O0lBQzVELHFDQUEwQjs7SUFDMUIsd0NBQThDOztJQUM5QyxzQ0FBeUM7O0lBQ3pDLHNDQUF5Qzs7SUFDekMscUNBQTBCOztJQUMxQixvQ0FBeUM7O0lBQ3pDLHFDQUEwQjs7SUFDMUIsa0NBQTJCOztJQUMzQixtQ0FBdUI7O0lBQ3ZCLCtDQUFnRTs7SUFDaEUsbUNBQXNDOztJQUN0QywwQ0FBNEM7O0lBRTVDLDRDQUFrRTs7SUFDbEUsNkNBQW1FOztJQUNuRSwrQ0FBcUU7Ozs7O0lBRXJFLHFDQUF5Qjs7SUF1QnpCLHdDQXFCQzs7SUFFRCx3Q0FnQkU7Ozs7O0lBM0RBLHVDQUE4Qjs7Ozs7SUFDOUIseUNBQWtDOzs7OztJQUNsQyxnQ0FBa0M7Ozs7O0lBRWxDLHVDQUErQzs7Ozs7SUFDL0MscUNBQTJCOzs7OztJQUMzQixpQ0FBb0I7Ozs7O0lBQ3BCLG1DQUFnRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzUGxhdGZvcm1TZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG4gIFNlY3VyaXR5Q29udGV4dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBOR19WQUxJREFUT1JTLFxuICBOR19WQUxVRV9BQ0NFU1NPUixcbiAgVmFsaWRhdG9yXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ3VzdG9tT3B0aW9uLCBOZ3hRdWlsbENvbmZpZywgTmd4UXVpbGxNb2R1bGVzIH0gZnJvbSAnLi9uZ3gtcXVpbGwuaW50ZXJmYWNlcyc7XG5cblxuLy8gaW1wb3J0ICogYXMgUXVpbGxOYW1lc3BhY2UgZnJvbSAncXVpbGwnXG4vLyBCZWNhdXNlIHF1aWxsIHVzZXMgYGRvY3VtZW50YCBkaXJlY3RseSwgd2UgY2Fubm90IGBpbXBvcnRgIGR1cmluZyBTU1Jcbi8vIGluc3RlYWQsIHdlIGxvYWQgZHluYW1pY2FsbHkgdmlhIGByZXF1aXJlKCdxdWlsbCcpYCBpbiBgbmdBZnRlclZpZXdJbml0KClgXG5kZWNsYXJlIHZhciByZXF1aXJlOiBhbnk7XG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxubGV0IFF1aWxsOiBhbnkgPSBudWxsO1xuXG5cblxuQENvbXBvbmVudCh7XG5cbiAgc2VsZWN0b3I6ICd3LW5neC1xdWlsbCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW3F1aWxsLWVkaXRvci10b29sYmFyXVwiPjwvbmctY29udGVudD5cbiAgYCxcbiAgc3R5bGVzOiBbXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgbXVsdGk6IHRydWUsXG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5neFF1aWxsQ29tcG9uZW50KVxuICAgIH0sXG4gICAge1xuICAgICAgbXVsdGk6IHRydWUsXG4gICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmd4UXVpbGxDb21wb25lbnQpXG4gICAgfVxuICBdLFxufSlcblxuZXhwb3J0IGNsYXNzIE5neFF1aWxsQ29tcG9uZW50XG4gIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBWYWxpZGF0b3Ige1xuXG4gIHF1aWxsRWRpdG9yOiBhbnk7XG4gIGVkaXRvckVsZW06IEhUTUxFbGVtZW50O1xuICBlbXB0eUFycmF5OiBhbnlbXSA9IFtdO1xuICBjb250ZW50OiBhbnk7XG4gIHNlbGVjdGlvbkNoYW5nZUV2ZW50OiBhbnk7XG4gIHRleHRDaGFuZ2VFdmVudDogYW55O1xuICBkZWZhdWx0TW9kdWxlczogTmd4UXVpbGxNb2R1bGVzIHwge307XG5cbiAgb25Nb2RlbENoYW5nZTogYW55O1xuICBvbk1vZGVsVG91Y2hlZDogYW55O1xuXG4gIEBJbnB1dCgpIGZvcm1hdDogJ29iamVjdCcgfCAnaHRtbCcgfCAndGV4dCcgfCAnanNvbicgPSAnaHRtbCc7XG4gIEBJbnB1dCgpIHRoZW1lID0gJ3Nub3cnO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6YmFuLXR5cGVzXG4gIEBJbnB1dCgpIG1vZHVsZXM6IHsgW2luZGV4OiBzdHJpbmddOiBPYmplY3QgfSB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSByZWFkT25seSA9IGZhbHNlO1xuICBASW5wdXQoKSBwbGFjZWhvbGRlciA9ICdJbnNlcnQgdGV4dCBoZXJlIC4uLic7XG4gIEBJbnB1dCgpIG1heExlbmd0aDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIG1pbkxlbmd0aDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIHJlcXVpcmVkID0gZmFsc2U7XG4gIEBJbnB1dCgpIGZvcm1hdHM6IHN0cmluZ1tdIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIHNhbml0aXplID0gZmFsc2U7XG4gIEBJbnB1dCgpIHN0eWxlOiBhbnkgPSBudWxsO1xuICBASW5wdXQoKSBzdHJpY3QgPSB0cnVlO1xuICBASW5wdXQoKSBzY3JvbGxpbmdDb250YWluZXI6IEhUTUxFbGVtZW50IHwgc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIGJvdW5kczogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIGN1c3RvbU9wdGlvbnM6IEN1c3RvbU9wdGlvbltdID0gW107XG5cbiAgQE91dHB1dCgpIG9uRWRpdG9yQ3JlYXRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkNvbnRlbnRDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uU2VsZWN0aW9uQ2hhbmdlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJpdmF0ZSBkaXNhYmxlZCA9IGZhbHNlOyAvLyB1c2VkIHRvIHN0b3JlIGluaXRpYWwgdmFsdWUgYmVmb3JlIFZpZXdJbml0XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgZG9tU2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2M6IGFueSxcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6YmFuLXR5cGVzXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBPYmplY3QsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgIEBJbmplY3QoJ2NvbmZpZycpIHByaXZhdGUgY29uZmlnOiBOZ3hRdWlsbENvbmZpZ1xuICApIHtcbiAgICB0aGlzLmRlZmF1bHRNb2R1bGVzID0gdGhpcy5jb25maWcgJiYgdGhpcy5jb25maWcubW9kdWxlcyB8fCB7fVxuICAgIHRoaXMuYm91bmRzID0gdGhpcy5kb2MuYm9keVxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTChcbiAgICAgICdiZWZvcmVlbmQnLFxuICAgICAgJzxkaXYgcXVpbGwtZWRpdG9yLWVsZW1lbnQ+PC9kaXY+J1xuICAgICk7XG4gICAgdGhpcy5lZGl0b3JFbGVtID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICdbcXVpbGwtZWRpdG9yLWVsZW1lbnRdJ1xuICAgICk7XG4gIH1cblxuICBASW5wdXQoKVxuICB2YWx1ZUdldHRlciA9IChxdWlsbEVkaXRvcjogYW55LCBlZGl0b3JFbGVtZW50OiBIVE1MRWxlbWVudCk6IGFueSA9PiB7XG4gICAgbGV0IGh0bWw6IHN0cmluZyB8IG51bGwgPSBlZGl0b3JFbGVtZW50LmNoaWxkcmVuWzBdLmlubmVySFRNTFxuICAgIGlmIChodG1sID09PSAnPHA+PGJyPjwvcD4nIHx8IGh0bWwgPT09ICc8ZGl2Pjxicj48ZGl2PicpIHtcbiAgICAgIGh0bWwgPSBudWxsO1xuICAgIH1cbiAgICBsZXQgbW9kZWxWYWx1ZSA9IGh0bWxcblxuICAgIGlmICh0aGlzLmZvcm1hdCA9PT0gJ3RleHQnKSB7XG4gICAgICBtb2RlbFZhbHVlID0gcXVpbGxFZGl0b3IuZ2V0VGV4dCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mb3JtYXQgPT09ICdvYmplY3QnKSB7XG4gICAgICBtb2RlbFZhbHVlID0gcXVpbGxFZGl0b3IuZ2V0Q29udGVudHMoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZm9ybWF0ID09PSAnanNvbicpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG1vZGVsVmFsdWUgPSBKU09OLnN0cmluZ2lmeShxdWlsbEVkaXRvci5nZXRDb250ZW50cygpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbW9kZWxWYWx1ZSA9IHF1aWxsRWRpdG9yLmdldFRleHQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW9kZWxWYWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHZhbHVlU2V0dGVyID0gKHF1aWxsRWRpdG9yOiBhbnksIHZhbHVlOiBhbnkpOiBhbnkgPT4ge1xuICAgIGlmICh0aGlzLmZvcm1hdCA9PT0gJ2h0bWwnKSB7XG4gICAgICBpZiAodGhpcy5zYW5pdGl6ZSkge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZG9tU2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5IVE1MLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcXVpbGxFZGl0b3IuY2xpcGJvYXJkLmNvbnZlcnQodmFsdWUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mb3JtYXQgPT09ICdqc29uJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gW3sgaW5zZXJ0OiB2YWx1ZSB9XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gO1xuICB9O1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAoaXNQbGF0Zm9ybVNlcnZlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghUXVpbGwpIHtcbiAgICAgIFF1aWxsID0gcmVxdWlyZSgncXVpbGwnKTtcbiAgICB9XG5cbiAgICBjb25zdCB0b29sYmFyRWxlbSA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAnW3F1aWxsLWVkaXRvci10b29sYmFyXSdcbiAgICApO1xuICAgIGNvbnN0IG1vZHVsZXMgPSB0aGlzLm1vZHVsZXMgfHwgdGhpcy5kZWZhdWx0TW9kdWxlc1xuICAgIGxldCBwbGFjZWhvbGRlciA9IHRoaXMucGxhY2Vob2xkZXJcblxuICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyICE9PSBudWxsICYmIHRoaXMucGxhY2Vob2xkZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcGxhY2Vob2xkZXIgPSB0aGlzLnBsYWNlaG9sZGVyLnRyaW0oKTtcbiAgICB9XG5cbiAgICBpZiAodG9vbGJhckVsZW0pIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zdHJpbmctbGl0ZXJhbFxuICAgICAgbW9kdWxlc1sndG9vbGJhciddID0gdG9vbGJhckVsZW07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3R5bGUpIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuc3R5bGUpLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lZGl0b3JFbGVtLCBrZXksIHRoaXMuc3R5bGVba2V5XSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmN1c3RvbU9wdGlvbnMuZm9yRWFjaCgoY3VzdG9tT3B0aW9uKSA9PiB7XG4gICAgICBjb25zdCBuZXdDdXN0b21PcHRpb24gPSBRdWlsbC5pbXBvcnQoY3VzdG9tT3B0aW9uLmltcG9ydClcbiAgICAgIG5ld0N1c3RvbU9wdGlvbi53aGl0ZWxpc3QgPSBjdXN0b21PcHRpb24ud2hpdGVsaXN0XG4gICAgICBRdWlsbC5yZWdpc3RlcihuZXdDdXN0b21PcHRpb24sIHRydWUpO1xuICAgIH0pXG5cbiAgICB0aGlzLnF1aWxsRWRpdG9yID0gbmV3IFF1aWxsKHRoaXMuZWRpdG9yRWxlbSwge1xuICAgICAgYm91bmRzOiB0aGlzLmJvdW5kcyA/ICh0aGlzLmJvdW5kcyA9PT0gJ3NlbGYnID8gdGhpcy5lZGl0b3JFbGVtIDogdGhpcy5ib3VuZHMpIDogdGhpcy5kb2MuYm9keSxcbiAgICAgIGZvcm1hdHM6IHRoaXMuZm9ybWF0cyxcbiAgICAgIG1vZHVsZXMsXG4gICAgICBwbGFjZWhvbGRlcixcbiAgICAgIHJlYWRPbmx5OiB0aGlzLnJlYWRPbmx5LFxuICAgICAgc2Nyb2xsaW5nQ29udGFpbmVyOiB0aGlzLnNjcm9sbGluZ0NvbnRhaW5lcixcbiAgICAgIHN0cmljdDogdGhpcy5zdHJpY3QsXG4gICAgICB0aGVtZTogdGhpcy50aGVtZSB8fCAnc25vdydcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgIGlmICh0aGlzLmZvcm1hdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRDb250ZW50cyh0aGlzLmNvbnRlbnQsICdzaWxlbnQnKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mb3JtYXQgPT09ICd0ZXh0Jykge1xuICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldFRleHQodGhpcy5jb250ZW50LCAnc2lsZW50Jyk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZm9ybWF0ID09PSAnanNvbicpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldENvbnRlbnRzKEpTT04ucGFyc2UodGhpcy5jb250ZW50KSwgJ3NpbGVudCcpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRUZXh0KHRoaXMuY29udGVudCwgJ3NpbGVudCcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5zYW5pdGl6ZSkge1xuICAgICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuZG9tU2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5IVE1MLCB0aGlzLmNvbnRlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbnRlbnRzID0gdGhpcy5xdWlsbEVkaXRvci5jbGlwYm9hcmQuY29udmVydCh0aGlzLmNvbnRlbnQpXG4gICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0Q29udGVudHMoY29udGVudHMsICdzaWxlbnQnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5xdWlsbEVkaXRvci5oaXN0b3J5LmNsZWFyKCk7XG4gICAgfVxuXG4gICAgLy8gaW5pdGlhbGl6ZSBkaXNhYmxlZCBzdGF0dXMgYmFzZWQgb24gdGhpcy5kaXNhYmxlZCBhcyBkZWZhdWx0IHZhbHVlXG4gICAgdGhpcy5zZXREaXNhYmxlZFN0YXRlKClcblxuICAgIHRoaXMub25FZGl0b3JDcmVhdGVkLmVtaXQodGhpcy5xdWlsbEVkaXRvcik7XG5cbiAgICAvLyBtYXJrIG1vZGVsIGFzIHRvdWNoZWQgaWYgZWRpdG9yIGxvc3QgZm9jdXNcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZUV2ZW50ID0gdGhpcy5xdWlsbEVkaXRvci5vbihcbiAgICAgICdzZWxlY3Rpb24tY2hhbmdlJyxcbiAgICAgIChyYW5nZTogYW55LCBvbGRSYW5nZTogYW55LCBzb3VyY2U6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLm9uU2VsZWN0aW9uQ2hhbmdlZC5lbWl0KHtcbiAgICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgICAgIG9sZFJhbmdlLFxuICAgICAgICAgICAgcmFuZ2UsXG4gICAgICAgICAgICBzb3VyY2VcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmICghcmFuZ2UgJiYgdGhpcy5vbk1vZGVsVG91Y2hlZCkge1xuICAgICAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIC8vIHVwZGF0ZSBtb2RlbCBpZiB0ZXh0IGNoYW5nZXNcbiAgICB0aGlzLnRleHRDaGFuZ2VFdmVudCA9IHRoaXMucXVpbGxFZGl0b3Iub24oXG4gICAgICAndGV4dC1jaGFuZ2UnLFxuICAgICAgKGRlbHRhOiBhbnksIG9sZERlbHRhOiBhbnksIHNvdXJjZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIC8vIG9ubHkgZW1pdCBjaGFuZ2VzIGVtaXR0ZWQgYnkgdXNlciBpbnRlcmFjdGlvbnNcblxuICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5xdWlsbEVkaXRvci5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldENvbnRlbnRzKCk7XG5cbiAgICAgICAgbGV0IGh0bWw6IHN0cmluZyB8IG51bGwgPSB0aGlzLmVkaXRvckVsZW0uY2hpbGRyZW5bMF0uaW5uZXJIVE1MO1xuICAgICAgICBpZiAoaHRtbCA9PT0gJzxwPjxicj48L3A+JyB8fCBodG1sID09PSAnPGRpdj48YnI+PGRpdj4nKSB7XG4gICAgICAgICAgaHRtbCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICBpZiAoc291cmNlID09PSAndXNlcicgJiYgdGhpcy5vbk1vZGVsQ2hhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UoXG4gICAgICAgICAgICAgIHRoaXMudmFsdWVHZXR0ZXIodGhpcy5xdWlsbEVkaXRvciwgdGhpcy5lZGl0b3JFbGVtKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLm9uQ29udGVudENoYW5nZWQuZW1pdCh7XG4gICAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgICAgZGVsdGEsXG4gICAgICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgICAgICBodG1sLFxuICAgICAgICAgICAgb2xkRGVsdGEsXG4gICAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25DaGFuZ2VFdmVudCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2VFdmVudC5yZW1vdmVMaXN0ZW5lcignc2VsZWN0aW9uLWNoYW5nZScpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXh0Q2hhbmdlRXZlbnQpIHtcbiAgICAgIHRoaXMudGV4dENoYW5nZUV2ZW50LnJlbW92ZUxpc3RlbmVyKCd0ZXh0LWNoYW5nZScpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gdHNsaW50OmRpc2FibGU6bm8tc3RyaW5nLWxpdGVyYWxcbiAgICBpZiAoY2hhbmdlc1sncmVhZE9ubHknXSkge1xuICAgICAgdGhpcy5xdWlsbEVkaXRvci5lbmFibGUoIWNoYW5nZXNbJ3JlYWRPbmx5J10uY3VycmVudFZhbHVlKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ3BsYWNlaG9sZGVyJ10pIHtcbiAgICAgIHRoaXMucXVpbGxFZGl0b3Iucm9vdC5kYXRhc2V0LnBsYWNlaG9sZGVyID1cbiAgICAgICAgY2hhbmdlc1sncGxhY2Vob2xkZXInXS5jdXJyZW50VmFsdWU7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydzdHlsZSddKSB7XG4gICAgICBjb25zdCBjdXJyZW50U3R5bGluZyA9IGNoYW5nZXNbJ3N0eWxlJ10uY3VycmVudFZhbHVlXG4gICAgICBjb25zdCBwcmV2aW91c1N0eWxpbmcgPSBjaGFuZ2VzWydzdHlsZSddLnByZXZpb3VzVmFsdWVcblxuICAgICAgaWYgKHByZXZpb3VzU3R5bGluZykge1xuICAgICAgICBPYmplY3Qua2V5cyhwcmV2aW91c1N0eWxpbmcpLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVTdHlsZSh0aGlzLmVkaXRvckVsZW0sIGtleSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnRTdHlsaW5nKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGN1cnJlbnRTdHlsaW5nKS5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lZGl0b3JFbGVtLCBrZXksIHRoaXMuc3R5bGVba2V5XSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyB0c2xpbnQ6ZW5hYmxlOm5vLXN0cmluZy1saXRlcmFsXG4gIH1cblxuICB3cml0ZVZhbHVlKGN1cnJlbnRWYWx1ZTogYW55KSB7XG4gICAgdGhpcy5jb250ZW50ID0gY3VycmVudFZhbHVlXG5cbiAgICBpZiAodGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgaWYgKGN1cnJlbnRWYWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5mb3JtYXQgPT09ICd0ZXh0Jykge1xuICAgICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0VGV4dChjdXJyZW50VmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0Q29udGVudHMoXG4gICAgICAgICAgICB0aGlzLnZhbHVlU2V0dGVyKHRoaXMucXVpbGxFZGl0b3IsIHRoaXMuY29udGVudClcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0VGV4dCgnJyk7XG4gICAgfVxuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuID0gdGhpcy5kaXNhYmxlZCk6IHZvaWQge1xuICAgIC8vIHN0b3JlIGluaXRpYWwgdmFsdWUgdG8gc2V0IGFwcHJvcHJpYXRlIGRpc2FibGVkIHN0YXR1cyBhZnRlciBWaWV3SW5pdFxuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkXG4gICAgaWYgKHRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIGlmIChpc0Rpc2FibGVkKSB7XG4gICAgICAgIHRoaXMucXVpbGxFZGl0b3IuZGlzYWJsZSgpXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGhpcy5yZWFkT25seSkge1xuICAgICAgICAgIHRoaXMucXVpbGxFZGl0b3IuZW5hYmxlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIHZhbGlkYXRlKCkge1xuICAgIGlmICghdGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZXJyOiB7XG4gICAgICBtaW5MZW5ndGhFcnJvcj86IHtcbiAgICAgICAgZ2l2ZW46IG51bWJlclxuICAgICAgICBtaW5MZW5ndGg6IG51bWJlclxuICAgICAgfVxuICAgICAgbWF4TGVuZ3RoRXJyb3I/OiB7XG4gICAgICAgIGdpdmVuOiBudW1iZXJcbiAgICAgICAgbWF4TGVuZ3RoOiBudW1iZXJcbiAgICAgIH1cbiAgICAgIHJlcXVpcmVkRXJyb3I/OiB7IGVtcHR5OiBib29sZWFuIH1cbiAgICB9ID0ge31cbiAgICBsZXQgdmFsaWQgPSB0cnVlO1xuXG4gICAgY29uc3QgdGV4dExlbmd0aCA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0VGV4dCgpLnRyaW0oKS5sZW5ndGg7XG5cbiAgICBpZiAodGhpcy5taW5MZW5ndGggJiYgdGV4dExlbmd0aCAmJiB0ZXh0TGVuZ3RoIDwgdGhpcy5taW5MZW5ndGgpIHtcbiAgICAgIGVyci5taW5MZW5ndGhFcnJvciA9IHtcbiAgICAgICAgZ2l2ZW46IHRleHRMZW5ndGgsXG4gICAgICAgIG1pbkxlbmd0aDogdGhpcy5taW5MZW5ndGhcbiAgICAgIH1cblxuICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXhMZW5ndGggJiYgdGV4dExlbmd0aCA+IHRoaXMubWF4TGVuZ3RoKSB7XG4gICAgICBlcnIubWF4TGVuZ3RoRXJyb3IgPSB7XG4gICAgICAgIGdpdmVuOiB0ZXh0TGVuZ3RoLFxuICAgICAgICBtYXhMZW5ndGg6IHRoaXMubWF4TGVuZ3RoXG4gICAgICB9XG5cbiAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVxdWlyZWQgJiYgIXRleHRMZW5ndGgpIHtcbiAgICAgIGVyci5yZXF1aXJlZEVycm9yID0ge1xuICAgICAgICBlbXB0eTogdHJ1ZVxuICAgICAgfVxuXG4gICAgICB2YWxpZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxpZCA/IG51bGwgOiBlcnI7XG4gIH1cblxufVxuIl19