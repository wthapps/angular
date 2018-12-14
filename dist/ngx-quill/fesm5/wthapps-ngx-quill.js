import { Injectable, NgModule, defineInjectable, EventEmitter, SecurityContext, Component, ViewEncapsulation, forwardRef, ElementRef, Inject, PLATFORM_ID, Renderer2, NgZone, Input, Output } from '@angular/core';
import { isPlatformServer, DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NgxQuillService = /** @class */ (function () {
    function NgxQuillService() {
    }
    NgxQuillService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    NgxQuillService.ctorParameters = function () { return []; };
    /** @nocollapse */ NgxQuillService.ngInjectableDef = defineInjectable({ factory: function NgxQuillService_Factory() { return new NgxQuillService(); }, token: NgxQuillService, providedIn: "root" });
    return NgxQuillService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var emptyArray = [];
/** @type {?} */
var defaultModules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [
            { color: emptyArray.slice() },
            { background: emptyArray.slice() }
        ],
        [{ font: emptyArray.slice() }],
        [{ align: emptyArray.slice() }],
        ['clean'],
        ['link', 'image', 'video'] // link and image, video
    ]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ɵ0 = defaultModules;
var NgxQuillModule = /** @class */ (function () {
    function NgxQuillModule() {
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    NgxQuillModule.forRoot = /**
     * @param {?=} config
     * @return {?}
     */
    function (config) {
        return {
            ngModule: NgxQuillModule,
            providers: [
                {
                    provide: 'config',
                    useValue: config || defaultModules
                }
            ]
        };
    };
    NgxQuillModule.decorators = [
        { type: NgModule, args: [{
                    imports: [],
                    declarations: [NgxQuillComponent],
                    exports: [NgxQuillComponent],
                    providers: [
                        {
                            provide: 'config',
                            useValue: ɵ0
                        }
                    ],
                },] },
    ];
    return NgxQuillModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NgxQuillService, NgxQuillComponent, NgxQuillModule, defaultModules as ɵb };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3RoYXBwcy1uZ3gtcXVpbGwuanMubWFwIiwic291cmNlcyI6WyJuZzovL0B3dGhhcHBzL25neC1xdWlsbC9saWIvbmd4LXF1aWxsLnNlcnZpY2UudHMiLCJuZzovL0B3dGhhcHBzL25neC1xdWlsbC9saWIvbmd4LXF1aWxsLmNvbXBvbmVudC50cyIsIm5nOi8vQHd0aGFwcHMvbmd4LXF1aWxsL2xpYi9uZ3gtcXVpbGwuY29uc3RhbnRzLnRzIiwibmc6Ly9Ad3RoYXBwcy9uZ3gtcXVpbGwvbGliL25neC1xdWlsbC5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ3hRdWlsbFNlcnZpY2Uge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG59XG4iLCJpbXBvcnQgeyBpc1BsYXRmb3JtU2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBQTEFURk9STV9JRCxcbiAgUmVuZGVyZXIyLFxuICBTZWN1cml0eUNvbnRleHQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgTkdfVkFMSURBVE9SUyxcbiAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gIFZhbGlkYXRvclxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEN1c3RvbU9wdGlvbiwgTmd4UXVpbGxDb25maWcsIE5neFF1aWxsTW9kdWxlcyB9IGZyb20gJy4vbmd4LXF1aWxsLmludGVyZmFjZXMnO1xuXG5cbi8vIGltcG9ydCAqIGFzIFF1aWxsTmFtZXNwYWNlIGZyb20gJ3F1aWxsJ1xuLy8gQmVjYXVzZSBxdWlsbCB1c2VzIGBkb2N1bWVudGAgZGlyZWN0bHksIHdlIGNhbm5vdCBgaW1wb3J0YCBkdXJpbmcgU1NSXG4vLyBpbnN0ZWFkLCB3ZSBsb2FkIGR5bmFtaWNhbGx5IHZpYSBgcmVxdWlyZSgncXVpbGwnKWAgaW4gYG5nQWZ0ZXJWaWV3SW5pdCgpYFxuZGVjbGFyZSB2YXIgcmVxdWlyZTogYW55O1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbmxldCBRdWlsbDogYW55ID0gbnVsbDtcblxuXG5cbkBDb21wb25lbnQoe1xuXG4gIHNlbGVjdG9yOiAndy1uZ3gtcXVpbGwnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltxdWlsbC1lZGl0b3ItdG9vbGJhcl1cIj48L25nLWNvbnRlbnQ+XG4gIGAsXG4gIHN0eWxlczogW10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ3hRdWlsbENvbXBvbmVudClcbiAgICB9LFxuICAgIHtcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5neFF1aWxsQ29tcG9uZW50KVxuICAgIH1cbiAgXSxcbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hRdWlsbENvbXBvbmVudFxuICBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgVmFsaWRhdG9yIHtcblxuICBxdWlsbEVkaXRvcjogYW55O1xuICBlZGl0b3JFbGVtOiBIVE1MRWxlbWVudDtcbiAgZW1wdHlBcnJheTogYW55W10gPSBbXTtcbiAgY29udGVudDogYW55O1xuICBzZWxlY3Rpb25DaGFuZ2VFdmVudDogYW55O1xuICB0ZXh0Q2hhbmdlRXZlbnQ6IGFueTtcbiAgZGVmYXVsdE1vZHVsZXM6IE5neFF1aWxsTW9kdWxlcyB8IHt9O1xuXG4gIG9uTW9kZWxDaGFuZ2U6IGFueTtcbiAgb25Nb2RlbFRvdWNoZWQ6IGFueTtcblxuICBASW5wdXQoKSBmb3JtYXQ6ICdvYmplY3QnIHwgJ2h0bWwnIHwgJ3RleHQnIHwgJ2pzb24nID0gJ2h0bWwnO1xuICBASW5wdXQoKSB0aGVtZSA9ICdzbm93JztcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmJhbi10eXBlc1xuICBASW5wdXQoKSBtb2R1bGVzOiB7IFtpbmRleDogc3RyaW5nXTogT2JqZWN0IH0gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgcmVhZE9ubHkgPSBmYWxzZTtcbiAgQElucHV0KCkgcGxhY2Vob2xkZXIgPSAnSW5zZXJ0IHRleHQgaGVyZSAuLi4nO1xuICBASW5wdXQoKSBtYXhMZW5ndGg6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBtaW5MZW5ndGg6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSByZXF1aXJlZCA9IGZhbHNlO1xuICBASW5wdXQoKSBmb3JtYXRzOiBzdHJpbmdbXSB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBzYW5pdGl6ZSA9IGZhbHNlO1xuICBASW5wdXQoKSBzdHlsZTogYW55ID0gbnVsbDtcbiAgQElucHV0KCkgc3RyaWN0ID0gdHJ1ZTtcbiAgQElucHV0KCkgc2Nyb2xsaW5nQ29udGFpbmVyOiBIVE1MRWxlbWVudCB8IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBib3VuZHM6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICBASW5wdXQoKSBjdXN0b21PcHRpb25zOiBDdXN0b21PcHRpb25bXSA9IFtdO1xuXG4gIEBPdXRwdXQoKSBvbkVkaXRvckNyZWF0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25Db250ZW50Q2hhbmdlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvblNlbGVjdGlvbkNoYW5nZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgZGlzYWJsZWQgPSBmYWxzZTsgLy8gdXNlZCB0byBzdG9yZSBpbml0aWFsIHZhbHVlIGJlZm9yZSBWaWV3SW5pdFxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIGRvbVNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jOiBhbnksXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmJhbi10eXBlc1xuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KCdjb25maWcnKSBwcml2YXRlIGNvbmZpZzogTmd4UXVpbGxDb25maWdcbiAgKSB7XG4gICAgdGhpcy5kZWZhdWx0TW9kdWxlcyA9IHRoaXMuY29uZmlnICYmIHRoaXMuY29uZmlnLm1vZHVsZXMgfHwge31cbiAgICB0aGlzLmJvdW5kcyA9IHRoaXMuZG9jLmJvZHlcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgICAnYmVmb3JlZW5kJyxcbiAgICAgICc8ZGl2IHF1aWxsLWVkaXRvci1lbGVtZW50PjwvZGl2PidcbiAgICApO1xuICAgIHRoaXMuZWRpdG9yRWxlbSA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAnW3F1aWxsLWVkaXRvci1lbGVtZW50XSdcbiAgICApO1xuICB9XG5cbiAgQElucHV0KClcbiAgdmFsdWVHZXR0ZXIgPSAocXVpbGxFZGl0b3I6IGFueSwgZWRpdG9yRWxlbWVudDogSFRNTEVsZW1lbnQpOiBhbnkgPT4ge1xuICAgIGxldCBodG1sOiBzdHJpbmcgfCBudWxsID0gZWRpdG9yRWxlbWVudC5jaGlsZHJlblswXS5pbm5lckhUTUxcbiAgICBpZiAoaHRtbCA9PT0gJzxwPjxicj48L3A+JyB8fCBodG1sID09PSAnPGRpdj48YnI+PGRpdj4nKSB7XG4gICAgICBodG1sID0gbnVsbDtcbiAgICB9XG4gICAgbGV0IG1vZGVsVmFsdWUgPSBodG1sXG5cbiAgICBpZiAodGhpcy5mb3JtYXQgPT09ICd0ZXh0Jykge1xuICAgICAgbW9kZWxWYWx1ZSA9IHF1aWxsRWRpdG9yLmdldFRleHQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZm9ybWF0ID09PSAnb2JqZWN0Jykge1xuICAgICAgbW9kZWxWYWx1ZSA9IHF1aWxsRWRpdG9yLmdldENvbnRlbnRzKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZvcm1hdCA9PT0gJ2pzb24nKSB7XG4gICAgICB0cnkge1xuICAgICAgICBtb2RlbFZhbHVlID0gSlNPTi5zdHJpbmdpZnkocXVpbGxFZGl0b3IuZ2V0Q29udGVudHMoKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIG1vZGVsVmFsdWUgPSBxdWlsbEVkaXRvci5nZXRUZXh0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGVsVmFsdWU7XG4gIH1cblxuICBASW5wdXQoKVxuICB2YWx1ZVNldHRlciA9IChxdWlsbEVkaXRvcjogYW55LCB2YWx1ZTogYW55KTogYW55ID0+IHtcbiAgICBpZiAodGhpcy5mb3JtYXQgPT09ICdodG1sJykge1xuICAgICAgaWYgKHRoaXMuc2FuaXRpemUpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmRvbVNhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgdmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHF1aWxsRWRpdG9yLmNsaXBib2FyZC5jb252ZXJ0KHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZm9ybWF0ID09PSAnanNvbicpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFt7IGluc2VydDogdmFsdWUgfV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDtcbiAgfTtcblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIVF1aWxsKSB7XG4gICAgICBRdWlsbCA9IHJlcXVpcmUoJ3F1aWxsJyk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9vbGJhckVsZW0gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgJ1txdWlsbC1lZGl0b3ItdG9vbGJhcl0nXG4gICAgKTtcbiAgICBjb25zdCBtb2R1bGVzID0gdGhpcy5tb2R1bGVzIHx8IHRoaXMuZGVmYXVsdE1vZHVsZXNcbiAgICBsZXQgcGxhY2Vob2xkZXIgPSB0aGlzLnBsYWNlaG9sZGVyXG5cbiAgICBpZiAodGhpcy5wbGFjZWhvbGRlciAhPT0gbnVsbCAmJiB0aGlzLnBsYWNlaG9sZGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHBsYWNlaG9sZGVyID0gdGhpcy5wbGFjZWhvbGRlci50cmltKCk7XG4gICAgfVxuXG4gICAgaWYgKHRvb2xiYXJFbGVtKSB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tc3RyaW5nLWxpdGVyYWxcbiAgICAgIG1vZHVsZXNbJ3Rvb2xiYXInXSA9IHRvb2xiYXJFbGVtO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0eWxlKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnN0eWxlKS5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWRpdG9yRWxlbSwga2V5LCB0aGlzLnN0eWxlW2tleV0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jdXN0b21PcHRpb25zLmZvckVhY2goKGN1c3RvbU9wdGlvbikgPT4ge1xuICAgICAgY29uc3QgbmV3Q3VzdG9tT3B0aW9uID0gUXVpbGwuaW1wb3J0KGN1c3RvbU9wdGlvbi5pbXBvcnQpXG4gICAgICBuZXdDdXN0b21PcHRpb24ud2hpdGVsaXN0ID0gY3VzdG9tT3B0aW9uLndoaXRlbGlzdFxuICAgICAgUXVpbGwucmVnaXN0ZXIobmV3Q3VzdG9tT3B0aW9uLCB0cnVlKTtcbiAgICB9KVxuXG4gICAgdGhpcy5xdWlsbEVkaXRvciA9IG5ldyBRdWlsbCh0aGlzLmVkaXRvckVsZW0sIHtcbiAgICAgIGJvdW5kczogdGhpcy5ib3VuZHMgPyAodGhpcy5ib3VuZHMgPT09ICdzZWxmJyA/IHRoaXMuZWRpdG9yRWxlbSA6IHRoaXMuYm91bmRzKSA6IHRoaXMuZG9jLmJvZHksXG4gICAgICBmb3JtYXRzOiB0aGlzLmZvcm1hdHMsXG4gICAgICBtb2R1bGVzLFxuICAgICAgcGxhY2Vob2xkZXIsXG4gICAgICByZWFkT25seTogdGhpcy5yZWFkT25seSxcbiAgICAgIHNjcm9sbGluZ0NvbnRhaW5lcjogdGhpcy5zY3JvbGxpbmdDb250YWluZXIsXG4gICAgICBzdHJpY3Q6IHRoaXMuc3RyaWN0LFxuICAgICAgdGhlbWU6IHRoaXMudGhlbWUgfHwgJ3Nub3cnXG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICBpZiAodGhpcy5mb3JtYXQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0Q29udGVudHModGhpcy5jb250ZW50LCAnc2lsZW50Jyk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZm9ybWF0ID09PSAndGV4dCcpIHtcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRUZXh0KHRoaXMuY29udGVudCwgJ3NpbGVudCcpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmZvcm1hdCA9PT0gJ2pzb24nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRDb250ZW50cyhKU09OLnBhcnNlKHRoaXMuY29udGVudCksICdzaWxlbnQnKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0VGV4dCh0aGlzLmNvbnRlbnQsICdzaWxlbnQnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuc2FuaXRpemUpIHtcbiAgICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmRvbVNhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgdGhpcy5jb250ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb250ZW50cyA9IHRoaXMucXVpbGxFZGl0b3IuY2xpcGJvYXJkLmNvbnZlcnQodGhpcy5jb250ZW50KVxuICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldENvbnRlbnRzKGNvbnRlbnRzLCAnc2lsZW50Jyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucXVpbGxFZGl0b3IuaGlzdG9yeS5jbGVhcigpO1xuICAgIH1cblxuICAgIC8vIGluaXRpYWxpemUgZGlzYWJsZWQgc3RhdHVzIGJhc2VkIG9uIHRoaXMuZGlzYWJsZWQgYXMgZGVmYXVsdCB2YWx1ZVxuICAgIHRoaXMuc2V0RGlzYWJsZWRTdGF0ZSgpXG5cbiAgICB0aGlzLm9uRWRpdG9yQ3JlYXRlZC5lbWl0KHRoaXMucXVpbGxFZGl0b3IpO1xuXG4gICAgLy8gbWFyayBtb2RlbCBhcyB0b3VjaGVkIGlmIGVkaXRvciBsb3N0IGZvY3VzXG4gICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2VFdmVudCA9IHRoaXMucXVpbGxFZGl0b3Iub24oXG4gICAgICAnc2VsZWN0aW9uLWNoYW5nZScsXG4gICAgICAocmFuZ2U6IGFueSwgb2xkUmFuZ2U6IGFueSwgc291cmNlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5vblNlbGVjdGlvbkNoYW5nZWQuZW1pdCh7XG4gICAgICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgICAgICBvbGRSYW5nZSxcbiAgICAgICAgICAgIHJhbmdlLFxuICAgICAgICAgICAgc291cmNlXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAoIXJhbmdlICYmIHRoaXMub25Nb2RlbFRvdWNoZWQpIHtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG5cbiAgICAvLyB1cGRhdGUgbW9kZWwgaWYgdGV4dCBjaGFuZ2VzXG4gICAgdGhpcy50ZXh0Q2hhbmdlRXZlbnQgPSB0aGlzLnF1aWxsRWRpdG9yLm9uKFxuICAgICAgJ3RleHQtY2hhbmdlJyxcbiAgICAgIChkZWx0YTogYW55LCBvbGREZWx0YTogYW55LCBzb3VyY2U6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAvLyBvbmx5IGVtaXQgY2hhbmdlcyBlbWl0dGVkIGJ5IHVzZXIgaW50ZXJhY3Rpb25zXG5cbiAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5xdWlsbEVkaXRvci5nZXRDb250ZW50cygpO1xuXG4gICAgICAgIGxldCBodG1sOiBzdHJpbmcgfCBudWxsID0gdGhpcy5lZGl0b3JFbGVtLmNoaWxkcmVuWzBdLmlubmVySFRNTDtcbiAgICAgICAgaWYgKGh0bWwgPT09ICc8cD48YnI+PC9wPicgfHwgaHRtbCA9PT0gJzxkaXY+PGJyPjxkaXY+Jykge1xuICAgICAgICAgIGh0bWwgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgaWYgKHNvdXJjZSA9PT0gJ3VzZXInICYmIHRoaXMub25Nb2RlbENoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKFxuICAgICAgICAgICAgICB0aGlzLnZhbHVlR2V0dGVyKHRoaXMucXVpbGxFZGl0b3IsIHRoaXMuZWRpdG9yRWxlbSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5vbkNvbnRlbnRDaGFuZ2VkLmVtaXQoe1xuICAgICAgICAgICAgY29udGVudCxcbiAgICAgICAgICAgIGRlbHRhLFxuICAgICAgICAgICAgZWRpdG9yOiB0aGlzLnF1aWxsRWRpdG9yLFxuICAgICAgICAgICAgaHRtbCxcbiAgICAgICAgICAgIG9sZERlbHRhLFxuICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgdGV4dFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uQ2hhbmdlRXZlbnQpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlRXZlbnQucmVtb3ZlTGlzdGVuZXIoJ3NlbGVjdGlvbi1jaGFuZ2UnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGV4dENoYW5nZUV2ZW50KSB7XG4gICAgICB0aGlzLnRleHRDaGFuZ2VFdmVudC5yZW1vdmVMaXN0ZW5lcigndGV4dC1jaGFuZ2UnKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnF1aWxsRWRpdG9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIHRzbGludDpkaXNhYmxlOm5vLXN0cmluZy1saXRlcmFsXG4gICAgaWYgKGNoYW5nZXNbJ3JlYWRPbmx5J10pIHtcbiAgICAgIHRoaXMucXVpbGxFZGl0b3IuZW5hYmxlKCFjaGFuZ2VzWydyZWFkT25seSddLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydwbGFjZWhvbGRlciddKSB7XG4gICAgICB0aGlzLnF1aWxsRWRpdG9yLnJvb3QuZGF0YXNldC5wbGFjZWhvbGRlciA9XG4gICAgICAgIGNoYW5nZXNbJ3BsYWNlaG9sZGVyJ10uY3VycmVudFZhbHVlO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snc3R5bGUnXSkge1xuICAgICAgY29uc3QgY3VycmVudFN0eWxpbmcgPSBjaGFuZ2VzWydzdHlsZSddLmN1cnJlbnRWYWx1ZVxuICAgICAgY29uc3QgcHJldmlvdXNTdHlsaW5nID0gY2hhbmdlc1snc3R5bGUnXS5wcmV2aW91c1ZhbHVlXG5cbiAgICAgIGlmIChwcmV2aW91c1N0eWxpbmcpIHtcbiAgICAgICAgT2JqZWN0LmtleXMocHJldmlvdXNTdHlsaW5nKS5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlU3R5bGUodGhpcy5lZGl0b3JFbGVtLCBrZXkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50U3R5bGluZykge1xuICAgICAgICBPYmplY3Qua2V5cyhjdXJyZW50U3R5bGluZykuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWRpdG9yRWxlbSwga2V5LCB0aGlzLnN0eWxlW2tleV0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gdHNsaW50OmVuYWJsZTpuby1zdHJpbmctbGl0ZXJhbFxuICB9XG5cbiAgd3JpdGVWYWx1ZShjdXJyZW50VmFsdWU6IGFueSkge1xuICAgIHRoaXMuY29udGVudCA9IGN1cnJlbnRWYWx1ZVxuXG4gICAgaWYgKHRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIGlmIChjdXJyZW50VmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybWF0ID09PSAndGV4dCcpIHtcbiAgICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldFRleHQoY3VycmVudFZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldENvbnRlbnRzKFxuICAgICAgICAgICAgdGhpcy52YWx1ZVNldHRlcih0aGlzLnF1aWxsRWRpdG9yLCB0aGlzLmNvbnRlbnQpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldFRleHQoJycpO1xuICAgIH1cbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbiA9IHRoaXMuZGlzYWJsZWQpOiB2b2lkIHtcbiAgICAvLyBzdG9yZSBpbml0aWFsIHZhbHVlIHRvIHNldCBhcHByb3ByaWF0ZSBkaXNhYmxlZCBzdGF0dXMgYWZ0ZXIgVmlld0luaXRcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZFxuICAgIGlmICh0aGlzLnF1aWxsRWRpdG9yKSB7XG4gICAgICBpZiAoaXNEaXNhYmxlZCkge1xuICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLmRpc2FibGUoKVxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXRoaXMucmVhZE9ubHkpIHtcbiAgICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLmVuYWJsZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQXR0cmlidXRlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uTW9kZWxDaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uTW9kZWxUb3VjaGVkID0gZm47XG4gIH1cblxuICB2YWxpZGF0ZSgpIHtcbiAgICBpZiAoIXRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGVycjoge1xuICAgICAgbWluTGVuZ3RoRXJyb3I/OiB7XG4gICAgICAgIGdpdmVuOiBudW1iZXJcbiAgICAgICAgbWluTGVuZ3RoOiBudW1iZXJcbiAgICAgIH1cbiAgICAgIG1heExlbmd0aEVycm9yPzoge1xuICAgICAgICBnaXZlbjogbnVtYmVyXG4gICAgICAgIG1heExlbmd0aDogbnVtYmVyXG4gICAgICB9XG4gICAgICByZXF1aXJlZEVycm9yPzogeyBlbXB0eTogYm9vbGVhbiB9XG4gICAgfSA9IHt9XG4gICAgbGV0IHZhbGlkID0gdHJ1ZTtcblxuICAgIGNvbnN0IHRleHRMZW5ndGggPSB0aGlzLnF1aWxsRWRpdG9yLmdldFRleHQoKS50cmltKCkubGVuZ3RoO1xuXG4gICAgaWYgKHRoaXMubWluTGVuZ3RoICYmIHRleHRMZW5ndGggJiYgdGV4dExlbmd0aCA8IHRoaXMubWluTGVuZ3RoKSB7XG4gICAgICBlcnIubWluTGVuZ3RoRXJyb3IgPSB7XG4gICAgICAgIGdpdmVuOiB0ZXh0TGVuZ3RoLFxuICAgICAgICBtaW5MZW5ndGg6IHRoaXMubWluTGVuZ3RoXG4gICAgICB9XG5cbiAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF4TGVuZ3RoICYmIHRleHRMZW5ndGggPiB0aGlzLm1heExlbmd0aCkge1xuICAgICAgZXJyLm1heExlbmd0aEVycm9yID0ge1xuICAgICAgICBnaXZlbjogdGV4dExlbmd0aCxcbiAgICAgICAgbWF4TGVuZ3RoOiB0aGlzLm1heExlbmd0aFxuICAgICAgfVxuXG4gICAgICB2YWxpZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlcXVpcmVkICYmICF0ZXh0TGVuZ3RoKSB7XG4gICAgICBlcnIucmVxdWlyZWRFcnJvciA9IHtcbiAgICAgICAgZW1wdHk6IHRydWVcbiAgICAgIH1cblxuICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWQgPyBudWxsIDogZXJyO1xuICB9XG5cbn1cbiIsImNvbnN0IGVtcHR5QXJyYXk6IGFueVtdID0gW107XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0TW9kdWxlcyA9IHtcbiAgdG9vbGJhcjogW1xuICAgIFsnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZSddLCAvLyB0b2dnbGVkIGJ1dHRvbnNcbiAgICBbJ2Jsb2NrcXVvdGUnLCAnY29kZS1ibG9jayddLFxuXG4gICAgW3sgaGVhZGVyOiAxIH0sIHsgaGVhZGVyOiAyIH1dLCAvLyBjdXN0b20gYnV0dG9uIHZhbHVlc1xuICAgIFt7IGxpc3Q6ICdvcmRlcmVkJyB9LCB7IGxpc3Q6ICdidWxsZXQnIH1dLFxuICAgIFt7IHNjcmlwdDogJ3N1YicgfSwgeyBzY3JpcHQ6ICdzdXBlcicgfV0sIC8vIHN1cGVyc2NyaXB0L3N1YnNjcmlwdFxuICAgIFt7IGluZGVudDogJy0xJyB9LCB7IGluZGVudDogJysxJyB9XSwgLy8gb3V0ZGVudC9pbmRlbnRcbiAgICBbeyBkaXJlY3Rpb246ICdydGwnIH1dLCAvLyB0ZXh0IGRpcmVjdGlvblxuXG4gICAgW3sgc2l6ZTogWydzbWFsbCcsIGZhbHNlLCAnbGFyZ2UnLCAnaHVnZSddIH1dLCAvLyBjdXN0b20gZHJvcGRvd25cbiAgICBbeyBoZWFkZXI6IFsxLCAyLCAzLCA0LCA1LCA2LCBmYWxzZV0gfV0sXG5cbiAgICBbXG4gICAgICB7IGNvbG9yOiBlbXB0eUFycmF5LnNsaWNlKCkgfSxcbiAgICAgIHsgYmFja2dyb3VuZDogZW1wdHlBcnJheS5zbGljZSgpIH1cbiAgICBdLCAvLyBkcm9wZG93biB3aXRoIGRlZmF1bHRzIGZyb20gdGhlbWVcbiAgICBbeyBmb250OiBlbXB0eUFycmF5LnNsaWNlKCkgfV0sXG4gICAgW3sgYWxpZ246IGVtcHR5QXJyYXkuc2xpY2UoKSB9XSxcblxuICAgIFsnY2xlYW4nXSwgLy8gcmVtb3ZlIGZvcm1hdHRpbmcgYnV0dG9uXG5cbiAgICBbJ2xpbmsnLCAnaW1hZ2UnLCAndmlkZW8nXSAvLyBsaW5rIGFuZCBpbWFnZSwgdmlkZW9cbiAgXVxufTtcbiIsImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ3hRdWlsbENvbXBvbmVudCB9IGZyb20gJy4vbmd4LXF1aWxsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hRdWlsbENvbmZpZyB9IGZyb20gJy4vbmd4LXF1aWxsLmludGVyZmFjZXMnO1xuaW1wb3J0IHsgZGVmYXVsdE1vZHVsZXMgfSBmcm9tICcuL25neC1xdWlsbC5jb25zdGFudHMnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW05neFF1aWxsQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05neFF1aWxsQ29tcG9uZW50XSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogJ2NvbmZpZycsXG4gICAgICB1c2VWYWx1ZTogZGVmYXVsdE1vZHVsZXNcbiAgICB9XG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE5neFF1aWxsTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoY29uZmlnPzogTmd4UXVpbGxDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IE5neFF1aWxsTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiAnY29uZmlnJyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnIHx8IGRlZmF1bHRNb2R1bGVzXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH1cbn1cblxuXG5cblxuXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7SUFPRTtLQUFpQjs7Z0JBTGxCLFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7Ozs7OzBCQUpEO0NBUUM7Ozs7OztBQ1JEOztJQXNDSSxLQUFLLEdBQVEsSUFBSTtBQUlyQjtJQTJERSwyQkFDVSxVQUFzQixFQUN0QixZQUEwQixFQUNSLEdBQVEsRUFFTCxVQUFrQixFQUN2QyxRQUFtQixFQUNuQixJQUFZLEVBQ00sTUFBc0I7UUFSbEQsaUJBbUJDO1FBbEJTLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDUixRQUFHLEdBQUgsR0FBRyxDQUFLO1FBRUwsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUN2QyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLFNBQUksR0FBSixJQUFJLENBQVE7UUFDTSxXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQXhDbEQsZUFBVSxHQUFVLEVBQUUsQ0FBQztRQVNkLFdBQU0sR0FBd0MsTUFBTSxDQUFDO1FBQ3JELFVBQUssR0FBRyxNQUFNLENBQUM7O1FBRWYsWUFBTyxHQUF1QyxJQUFJLENBQUM7UUFD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