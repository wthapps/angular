(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/platform-browser'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('@wthapps/ngx-quill', ['exports', '@angular/core', '@angular/common', '@angular/platform-browser', '@angular/forms'], factory) :
    (factory((global.wthapps = global.wthapps || {}, global.wthapps['ngx-quill'] = {}),global.ng.core,global.ng.common,global.ng.platformBrowser,global.ng.forms));
}(this, (function (exports,i0,common,platformBrowser,forms) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgxQuillService = /** @class */ (function () {
        function NgxQuillService() {
        }
        NgxQuillService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        NgxQuillService.ctorParameters = function () { return []; };
        /** @nocollapse */ NgxQuillService.ngInjectableDef = i0.defineInjectable({ factory: function NgxQuillService_Factory() { return new NgxQuillService(); }, token: NgxQuillService, providedIn: "root" });
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
            this.onEditorCreated = new i0.EventEmitter();
            this.onContentChanged = new i0.EventEmitter();
            this.onSelectionChanged = new i0.EventEmitter();
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
                        value = _this.domSanitizer.sanitize(i0.SecurityContext.HTML, value);
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
                if (common.isPlatformServer(this.platformId)) {
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
                            this.content = this.domSanitizer.sanitize(i0.SecurityContext.HTML, this.content);
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
                if (isDisabled === void 0) {
                    isDisabled = this.disabled;
                }
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
            { type: i0.Component, args: [{
                        selector: 'w-ngx-quill',
                        template: "\n    <ng-content select=\"[quill-editor-toolbar]\"></ng-content>\n  ",
                        styles: [],
                        encapsulation: i0.ViewEncapsulation.None,
                        providers: [
                            {
                                multi: true,
                                provide: forms.NG_VALUE_ACCESSOR,
                                useExisting: i0.forwardRef(function () { return NgxQuillComponent; })
                            },
                            {
                                multi: true,
                                provide: forms.NG_VALIDATORS,
                                useExisting: i0.forwardRef(function () { return NgxQuillComponent; })
                            }
                        ],
                    },] },
        ];
        /** @nocollapse */
        NgxQuillComponent.ctorParameters = function () {
            return [
                { type: i0.ElementRef },
                { type: platformBrowser.DomSanitizer },
                { type: undefined, decorators: [{ type: i0.Inject, args: [common.DOCUMENT,] }] },
                { type: Object, decorators: [{ type: i0.Inject, args: [i0.PLATFORM_ID,] }] },
                { type: i0.Renderer2 },
                { type: i0.NgZone },
                { type: undefined, decorators: [{ type: i0.Inject, args: ['config',] }] }
            ];
        };
        NgxQuillComponent.propDecorators = {
            format: [{ type: i0.Input }],
            theme: [{ type: i0.Input }],
            modules: [{ type: i0.Input }],
            readOnly: [{ type: i0.Input }],
            placeholder: [{ type: i0.Input }],
            maxLength: [{ type: i0.Input }],
            minLength: [{ type: i0.Input }],
            required: [{ type: i0.Input }],
            formats: [{ type: i0.Input }],
            sanitize: [{ type: i0.Input }],
            style: [{ type: i0.Input }],
            strict: [{ type: i0.Input }],
            scrollingContainer: [{ type: i0.Input }],
            bounds: [{ type: i0.Input }],
            customOptions: [{ type: i0.Input }],
            onEditorCreated: [{ type: i0.Output }],
            onContentChanged: [{ type: i0.Output }],
            onSelectionChanged: [{ type: i0.Output }],
            valueGetter: [{ type: i0.Input }],
            valueSetter: [{ type: i0.Input }]
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
            { type: i0.NgModule, args: [{
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

    exports.NgxQuillService = NgxQuillService;
    exports.NgxQuillComponent = NgxQuillComponent;
    exports.NgxQuillModule = NgxQuillModule;
    exports.ɵb = defaultModules;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3RoYXBwcy1uZ3gtcXVpbGwudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9Ad3RoYXBwcy9uZ3gtcXVpbGwvbGliL25neC1xdWlsbC5zZXJ2aWNlLnRzIiwibmc6Ly9Ad3RoYXBwcy9uZ3gtcXVpbGwvbGliL25neC1xdWlsbC5jb21wb25lbnQudHMiLCJuZzovL0B3dGhhcHBzL25neC1xdWlsbC9saWIvbmd4LXF1aWxsLmNvbnN0YW50cy50cyIsIm5nOi8vQHd0aGFwcHMvbmd4LXF1aWxsL2xpYi9uZ3gtcXVpbGwubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmd4UXVpbGxTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxufVxuIiwiaW1wb3J0IHsgaXNQbGF0Zm9ybVNlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUExBVEZPUk1fSUQsXG4gIFJlbmRlcmVyMixcbiAgU2VjdXJpdHlDb250ZXh0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIE5HX1ZBTElEQVRPUlMsXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBWYWxpZGF0b3Jcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDdXN0b21PcHRpb24sIE5neFF1aWxsQ29uZmlnLCBOZ3hRdWlsbE1vZHVsZXMgfSBmcm9tICcuL25neC1xdWlsbC5pbnRlcmZhY2VzJztcblxuXG4vLyBpbXBvcnQgKiBhcyBRdWlsbE5hbWVzcGFjZSBmcm9tICdxdWlsbCdcbi8vIEJlY2F1c2UgcXVpbGwgdXNlcyBgZG9jdW1lbnRgIGRpcmVjdGx5LCB3ZSBjYW5ub3QgYGltcG9ydGAgZHVyaW5nIFNTUlxuLy8gaW5zdGVhZCwgd2UgbG9hZCBkeW5hbWljYWxseSB2aWEgYHJlcXVpcmUoJ3F1aWxsJylgIGluIGBuZ0FmdGVyVmlld0luaXQoKWBcbmRlY2xhcmUgdmFyIHJlcXVpcmU6IGFueTtcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG5sZXQgUXVpbGw6IGFueSA9IG51bGw7XG5cblxuXG5AQ29tcG9uZW50KHtcblxuICBzZWxlY3RvcjogJ3ctbmd4LXF1aWxsJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbcXVpbGwtZWRpdG9yLXRvb2xiYXJdXCI+PC9uZy1jb250ZW50PlxuICBgLFxuICBzdHlsZXM6IFtdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmd4UXVpbGxDb21wb25lbnQpXG4gICAgfSxcbiAgICB7XG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ3hRdWlsbENvbXBvbmVudClcbiAgICB9XG4gIF0sXG59KVxuXG5leHBvcnQgY2xhc3MgTmd4UXVpbGxDb21wb25lbnRcbiAgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIFZhbGlkYXRvciB7XG5cbiAgcXVpbGxFZGl0b3I6IGFueTtcbiAgZWRpdG9yRWxlbTogSFRNTEVsZW1lbnQ7XG4gIGVtcHR5QXJyYXk6IGFueVtdID0gW107XG4gIGNvbnRlbnQ6IGFueTtcbiAgc2VsZWN0aW9uQ2hhbmdlRXZlbnQ6IGFueTtcbiAgdGV4dENoYW5nZUV2ZW50OiBhbnk7XG4gIGRlZmF1bHRNb2R1bGVzOiBOZ3hRdWlsbE1vZHVsZXMgfCB7fTtcblxuICBvbk1vZGVsQ2hhbmdlOiBhbnk7XG4gIG9uTW9kZWxUb3VjaGVkOiBhbnk7XG5cbiAgQElucHV0KCkgZm9ybWF0OiAnb2JqZWN0JyB8ICdodG1sJyB8ICd0ZXh0JyB8ICdqc29uJyA9ICdodG1sJztcbiAgQElucHV0KCkgdGhlbWUgPSAnc25vdyc7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpiYW4tdHlwZXNcbiAgQElucHV0KCkgbW9kdWxlczogeyBbaW5kZXg6IHN0cmluZ106IE9iamVjdCB9IHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIHJlYWRPbmx5ID0gZmFsc2U7XG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyID0gJ0luc2VydCB0ZXh0IGhlcmUgLi4uJztcbiAgQElucHV0KCkgbWF4TGVuZ3RoOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbWluTGVuZ3RoOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgcmVxdWlyZWQgPSBmYWxzZTtcbiAgQElucHV0KCkgZm9ybWF0czogc3RyaW5nW10gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgc2FuaXRpemUgPSBmYWxzZTtcbiAgQElucHV0KCkgc3R5bGU6IGFueSA9IG51bGw7XG4gIEBJbnB1dCgpIHN0cmljdCA9IHRydWU7XG4gIEBJbnB1dCgpIHNjcm9sbGluZ0NvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgYm91bmRzOiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgQElucHV0KCkgY3VzdG9tT3B0aW9uczogQ3VzdG9tT3B0aW9uW10gPSBbXTtcblxuICBAT3V0cHV0KCkgb25FZGl0b3JDcmVhdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uQ29udGVudENoYW5nZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25TZWxlY3Rpb25DaGFuZ2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIGRpc2FibGVkID0gZmFsc2U7IC8vIHVzZWQgdG8gc3RvcmUgaW5pdGlhbCB2YWx1ZSBiZWZvcmUgVmlld0luaXRcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvYzogYW55LFxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpiYW4tdHlwZXNcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUsXG4gICAgQEluamVjdCgnY29uZmlnJykgcHJpdmF0ZSBjb25maWc6IE5neFF1aWxsQ29uZmlnXG4gICkge1xuICAgIHRoaXMuZGVmYXVsdE1vZHVsZXMgPSB0aGlzLmNvbmZpZyAmJiB0aGlzLmNvbmZpZy5tb2R1bGVzIHx8IHt9XG4gICAgdGhpcy5ib3VuZHMgPSB0aGlzLmRvYy5ib2R5XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgJ2JlZm9yZWVuZCcsXG4gICAgICAnPGRpdiBxdWlsbC1lZGl0b3ItZWxlbWVudD48L2Rpdj4nXG4gICAgKTtcbiAgICB0aGlzLmVkaXRvckVsZW0gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgJ1txdWlsbC1lZGl0b3ItZWxlbWVudF0nXG4gICAgKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHZhbHVlR2V0dGVyID0gKHF1aWxsRWRpdG9yOiBhbnksIGVkaXRvckVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYW55ID0+IHtcbiAgICBsZXQgaHRtbDogc3RyaW5nIHwgbnVsbCA9IGVkaXRvckVsZW1lbnQuY2hpbGRyZW5bMF0uaW5uZXJIVE1MXG4gICAgaWYgKGh0bWwgPT09ICc8cD48YnI+PC9wPicgfHwgaHRtbCA9PT0gJzxkaXY+PGJyPjxkaXY+Jykge1xuICAgICAgaHRtbCA9IG51bGw7XG4gICAgfVxuICAgIGxldCBtb2RlbFZhbHVlID0gaHRtbFxuXG4gICAgaWYgKHRoaXMuZm9ybWF0ID09PSAndGV4dCcpIHtcbiAgICAgIG1vZGVsVmFsdWUgPSBxdWlsbEVkaXRvci5nZXRUZXh0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZvcm1hdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG1vZGVsVmFsdWUgPSBxdWlsbEVkaXRvci5nZXRDb250ZW50cygpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mb3JtYXQgPT09ICdqc29uJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbW9kZWxWYWx1ZSA9IEpTT04uc3RyaW5naWZ5KHF1aWxsRWRpdG9yLmdldENvbnRlbnRzKCkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBtb2RlbFZhbHVlID0gcXVpbGxFZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2RlbFZhbHVlO1xuICB9XG5cbiAgQElucHV0KClcbiAgdmFsdWVTZXR0ZXIgPSAocXVpbGxFZGl0b3I6IGFueSwgdmFsdWU6IGFueSk6IGFueSA9PiB7XG4gICAgaWYgKHRoaXMuZm9ybWF0ID09PSAnaHRtbCcpIHtcbiAgICAgIGlmICh0aGlzLnNhbml0aXplKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5kb21TYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBxdWlsbEVkaXRvci5jbGlwYm9hcmQuY29udmVydCh2YWx1ZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZvcm1hdCA9PT0gJ2pzb24nKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBbeyBpbnNlcnQ6IHZhbHVlIH1dO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiA7XG4gIH07XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFRdWlsbCkge1xuICAgICAgUXVpbGwgPSByZXF1aXJlKCdxdWlsbCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHRvb2xiYXJFbGVtID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICdbcXVpbGwtZWRpdG9yLXRvb2xiYXJdJ1xuICAgICk7XG4gICAgY29uc3QgbW9kdWxlcyA9IHRoaXMubW9kdWxlcyB8fCB0aGlzLmRlZmF1bHRNb2R1bGVzXG4gICAgbGV0IHBsYWNlaG9sZGVyID0gdGhpcy5wbGFjZWhvbGRlclxuXG4gICAgaWYgKHRoaXMucGxhY2Vob2xkZXIgIT09IG51bGwgJiYgdGhpcy5wbGFjZWhvbGRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwbGFjZWhvbGRlciA9IHRoaXMucGxhY2Vob2xkZXIudHJpbSgpO1xuICAgIH1cblxuICAgIGlmICh0b29sYmFyRWxlbSkge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXN0cmluZy1saXRlcmFsXG4gICAgICBtb2R1bGVzWyd0b29sYmFyJ10gPSB0b29sYmFyRWxlbTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdHlsZSkge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5zdHlsZSkuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVkaXRvckVsZW0sIGtleSwgdGhpcy5zdHlsZVtrZXldKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuY3VzdG9tT3B0aW9ucy5mb3JFYWNoKChjdXN0b21PcHRpb24pID0+IHtcbiAgICAgIGNvbnN0IG5ld0N1c3RvbU9wdGlvbiA9IFF1aWxsLmltcG9ydChjdXN0b21PcHRpb24uaW1wb3J0KVxuICAgICAgbmV3Q3VzdG9tT3B0aW9uLndoaXRlbGlzdCA9IGN1c3RvbU9wdGlvbi53aGl0ZWxpc3RcbiAgICAgIFF1aWxsLnJlZ2lzdGVyKG5ld0N1c3RvbU9wdGlvbiwgdHJ1ZSk7XG4gICAgfSlcblxuICAgIHRoaXMucXVpbGxFZGl0b3IgPSBuZXcgUXVpbGwodGhpcy5lZGl0b3JFbGVtLCB7XG4gICAgICBib3VuZHM6IHRoaXMuYm91bmRzID8gKHRoaXMuYm91bmRzID09PSAnc2VsZicgPyB0aGlzLmVkaXRvckVsZW0gOiB0aGlzLmJvdW5kcykgOiB0aGlzLmRvYy5ib2R5LFxuICAgICAgZm9ybWF0czogdGhpcy5mb3JtYXRzLFxuICAgICAgbW9kdWxlcyxcbiAgICAgIHBsYWNlaG9sZGVyLFxuICAgICAgcmVhZE9ubHk6IHRoaXMucmVhZE9ubHksXG4gICAgICBzY3JvbGxpbmdDb250YWluZXI6IHRoaXMuc2Nyb2xsaW5nQ29udGFpbmVyLFxuICAgICAgc3RyaWN0OiB0aGlzLnN0cmljdCxcbiAgICAgIHRoZW1lOiB0aGlzLnRoZW1lIHx8ICdzbm93J1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgaWYgKHRoaXMuZm9ybWF0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldENvbnRlbnRzKHRoaXMuY29udGVudCwgJ3NpbGVudCcpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmZvcm1hdCA9PT0gJ3RleHQnKSB7XG4gICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0VGV4dCh0aGlzLmNvbnRlbnQsICdzaWxlbnQnKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mb3JtYXQgPT09ICdqc29uJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0Q29udGVudHMoSlNPTi5wYXJzZSh0aGlzLmNvbnRlbnQpLCAnc2lsZW50Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldFRleHQodGhpcy5jb250ZW50LCAnc2lsZW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnNhbml0aXplKSB7XG4gICAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5kb21TYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIHRoaXMuY29udGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29udGVudHMgPSB0aGlzLnF1aWxsRWRpdG9yLmNsaXBib2FyZC5jb252ZXJ0KHRoaXMuY29udGVudClcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRDb250ZW50cyhjb250ZW50cywgJ3NpbGVudCcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnF1aWxsRWRpdG9yLmhpc3RvcnkuY2xlYXIoKTtcbiAgICB9XG5cbiAgICAvLyBpbml0aWFsaXplIGRpc2FibGVkIHN0YXR1cyBiYXNlZCBvbiB0aGlzLmRpc2FibGVkIGFzIGRlZmF1bHQgdmFsdWVcbiAgICB0aGlzLnNldERpc2FibGVkU3RhdGUoKVxuXG4gICAgdGhpcy5vbkVkaXRvckNyZWF0ZWQuZW1pdCh0aGlzLnF1aWxsRWRpdG9yKTtcblxuICAgIC8vIG1hcmsgbW9kZWwgYXMgdG91Y2hlZCBpZiBlZGl0b3IgbG9zdCBmb2N1c1xuICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlRXZlbnQgPSB0aGlzLnF1aWxsRWRpdG9yLm9uKFxuICAgICAgJ3NlbGVjdGlvbi1jaGFuZ2UnLFxuICAgICAgKHJhbmdlOiBhbnksIG9sZFJhbmdlOiBhbnksIHNvdXJjZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMub25TZWxlY3Rpb25DaGFuZ2VkLmVtaXQoe1xuICAgICAgICAgICAgZWRpdG9yOiB0aGlzLnF1aWxsRWRpdG9yLFxuICAgICAgICAgICAgb2xkUmFuZ2UsXG4gICAgICAgICAgICByYW5nZSxcbiAgICAgICAgICAgIHNvdXJjZVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKCFyYW5nZSAmJiB0aGlzLm9uTW9kZWxUb3VjaGVkKSB7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gdXBkYXRlIG1vZGVsIGlmIHRleHQgY2hhbmdlc1xuICAgIHRoaXMudGV4dENoYW5nZUV2ZW50ID0gdGhpcy5xdWlsbEVkaXRvci5vbihcbiAgICAgICd0ZXh0LWNoYW5nZScsXG4gICAgICAoZGVsdGE6IGFueSwgb2xkRGVsdGE6IGFueSwgc291cmNlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgLy8gb25seSBlbWl0IGNoYW5nZXMgZW1pdHRlZCBieSB1c2VyIGludGVyYWN0aW9uc1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0Q29udGVudHMoKTtcblxuICAgICAgICBsZXQgaHRtbDogc3RyaW5nIHwgbnVsbCA9IHRoaXMuZWRpdG9yRWxlbS5jaGlsZHJlblswXS5pbm5lckhUTUw7XG4gICAgICAgIGlmIChodG1sID09PSAnPHA+PGJyPjwvcD4nIHx8IGh0bWwgPT09ICc8ZGl2Pjxicj48ZGl2PicpIHtcbiAgICAgICAgICBodG1sID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIGlmIChzb3VyY2UgPT09ICd1c2VyJyAmJiB0aGlzLm9uTW9kZWxDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZShcbiAgICAgICAgICAgICAgdGhpcy52YWx1ZUdldHRlcih0aGlzLnF1aWxsRWRpdG9yLCB0aGlzLmVkaXRvckVsZW0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMub25Db250ZW50Q2hhbmdlZC5lbWl0KHtcbiAgICAgICAgICAgIGNvbnRlbnQsXG4gICAgICAgICAgICBkZWx0YSxcbiAgICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgICAgIGh0bWwsXG4gICAgICAgICAgICBvbGREZWx0YSxcbiAgICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICAgIHRleHRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbkNoYW5nZUV2ZW50KSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZUV2ZW50LnJlbW92ZUxpc3RlbmVyKCdzZWxlY3Rpb24tY2hhbmdlJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRleHRDaGFuZ2VFdmVudCkge1xuICAgICAgdGhpcy50ZXh0Q2hhbmdlRXZlbnQucmVtb3ZlTGlzdGVuZXIoJ3RleHQtY2hhbmdlJyk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpuby1zdHJpbmctbGl0ZXJhbFxuICAgIGlmIChjaGFuZ2VzWydyZWFkT25seSddKSB7XG4gICAgICB0aGlzLnF1aWxsRWRpdG9yLmVuYWJsZSghY2hhbmdlc1sncmVhZE9ubHknXS5jdXJyZW50VmFsdWUpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1sncGxhY2Vob2xkZXInXSkge1xuICAgICAgdGhpcy5xdWlsbEVkaXRvci5yb290LmRhdGFzZXQucGxhY2Vob2xkZXIgPVxuICAgICAgICBjaGFuZ2VzWydwbGFjZWhvbGRlciddLmN1cnJlbnRWYWx1ZTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ3N0eWxlJ10pIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRTdHlsaW5nID0gY2hhbmdlc1snc3R5bGUnXS5jdXJyZW50VmFsdWVcbiAgICAgIGNvbnN0IHByZXZpb3VzU3R5bGluZyA9IGNoYW5nZXNbJ3N0eWxlJ10ucHJldmlvdXNWYWx1ZVxuXG4gICAgICBpZiAocHJldmlvdXNTdHlsaW5nKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHByZXZpb3VzU3R5bGluZykuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZVN0eWxlKHRoaXMuZWRpdG9yRWxlbSwga2V5KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudFN0eWxpbmcpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoY3VycmVudFN0eWxpbmcpLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVkaXRvckVsZW0sIGtleSwgdGhpcy5zdHlsZVtrZXldKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHRzbGludDplbmFibGU6bm8tc3RyaW5nLWxpdGVyYWxcbiAgfVxuXG4gIHdyaXRlVmFsdWUoY3VycmVudFZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLmNvbnRlbnQgPSBjdXJyZW50VmFsdWVcblxuICAgIGlmICh0aGlzLnF1aWxsRWRpdG9yKSB7XG4gICAgICBpZiAoY3VycmVudFZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmZvcm1hdCA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRUZXh0KGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRDb250ZW50cyhcbiAgICAgICAgICAgIHRoaXMudmFsdWVTZXR0ZXIodGhpcy5xdWlsbEVkaXRvciwgdGhpcy5jb250ZW50KVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRUZXh0KCcnKTtcbiAgICB9XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4gPSB0aGlzLmRpc2FibGVkKTogdm9pZCB7XG4gICAgLy8gc3RvcmUgaW5pdGlhbCB2YWx1ZSB0byBzZXQgYXBwcm9wcmlhdGUgZGlzYWJsZWQgc3RhdHVzIGFmdGVyIFZpZXdJbml0XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWRcbiAgICBpZiAodGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgaWYgKGlzRGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5kaXNhYmxlKClcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlYWRPbmx5KSB7XG4gICAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5lbmFibGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbk1vZGVsQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgdmFsaWRhdGUoKSB7XG4gICAgaWYgKCF0aGlzLnF1aWxsRWRpdG9yKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBlcnI6IHtcbiAgICAgIG1pbkxlbmd0aEVycm9yPzoge1xuICAgICAgICBnaXZlbjogbnVtYmVyXG4gICAgICAgIG1pbkxlbmd0aDogbnVtYmVyXG4gICAgICB9XG4gICAgICBtYXhMZW5ndGhFcnJvcj86IHtcbiAgICAgICAgZ2l2ZW46IG51bWJlclxuICAgICAgICBtYXhMZW5ndGg6IG51bWJlclxuICAgICAgfVxuICAgICAgcmVxdWlyZWRFcnJvcj86IHsgZW1wdHk6IGJvb2xlYW4gfVxuICAgIH0gPSB7fVxuICAgIGxldCB2YWxpZCA9IHRydWU7XG5cbiAgICBjb25zdCB0ZXh0TGVuZ3RoID0gdGhpcy5xdWlsbEVkaXRvci5nZXRUZXh0KCkudHJpbSgpLmxlbmd0aDtcblxuICAgIGlmICh0aGlzLm1pbkxlbmd0aCAmJiB0ZXh0TGVuZ3RoICYmIHRleHRMZW5ndGggPCB0aGlzLm1pbkxlbmd0aCkge1xuICAgICAgZXJyLm1pbkxlbmd0aEVycm9yID0ge1xuICAgICAgICBnaXZlbjogdGV4dExlbmd0aCxcbiAgICAgICAgbWluTGVuZ3RoOiB0aGlzLm1pbkxlbmd0aFxuICAgICAgfVxuXG4gICAgICB2YWxpZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1heExlbmd0aCAmJiB0ZXh0TGVuZ3RoID4gdGhpcy5tYXhMZW5ndGgpIHtcbiAgICAgIGVyci5tYXhMZW5ndGhFcnJvciA9IHtcbiAgICAgICAgZ2l2ZW46IHRleHRMZW5ndGgsXG4gICAgICAgIG1heExlbmd0aDogdGhpcy5tYXhMZW5ndGhcbiAgICAgIH1cblxuICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZXF1aXJlZCAmJiAhdGV4dExlbmd0aCkge1xuICAgICAgZXJyLnJlcXVpcmVkRXJyb3IgPSB7XG4gICAgICAgIGVtcHR5OiB0cnVlXG4gICAgICB9XG5cbiAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkID8gbnVsbCA6IGVycjtcbiAgfVxuXG59XG4iLCJjb25zdCBlbXB0eUFycmF5OiBhbnlbXSA9IFtdO1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdE1vZHVsZXMgPSB7XG4gIHRvb2xiYXI6IFtcbiAgICBbJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2UnXSwgLy8gdG9nZ2xlZCBidXR0b25zXG4gICAgWydibG9ja3F1b3RlJywgJ2NvZGUtYmxvY2snXSxcblxuICAgIFt7IGhlYWRlcjogMSB9LCB7IGhlYWRlcjogMiB9XSwgLy8gY3VzdG9tIGJ1dHRvbiB2YWx1ZXNcbiAgICBbeyBsaXN0OiAnb3JkZXJlZCcgfSwgeyBsaXN0OiAnYnVsbGV0JyB9XSxcbiAgICBbeyBzY3JpcHQ6ICdzdWInIH0sIHsgc2NyaXB0OiAnc3VwZXInIH1dLCAvLyBzdXBlcnNjcmlwdC9zdWJzY3JpcHRcbiAgICBbeyBpbmRlbnQ6ICctMScgfSwgeyBpbmRlbnQ6ICcrMScgfV0sIC8vIG91dGRlbnQvaW5kZW50XG4gICAgW3sgZGlyZWN0aW9uOiAncnRsJyB9XSwgLy8gdGV4dCBkaXJlY3Rpb25cblxuICAgIFt7IHNpemU6IFsnc21hbGwnLCBmYWxzZSwgJ2xhcmdlJywgJ2h1Z2UnXSB9XSwgLy8gY3VzdG9tIGRyb3Bkb3duXG4gICAgW3sgaGVhZGVyOiBbMSwgMiwgMywgNCwgNSwgNiwgZmFsc2VdIH1dLFxuXG4gICAgW1xuICAgICAgeyBjb2xvcjogZW1wdHlBcnJheS5zbGljZSgpIH0sXG4gICAgICB7IGJhY2tncm91bmQ6IGVtcHR5QXJyYXkuc2xpY2UoKSB9XG4gICAgXSwgLy8gZHJvcGRvd24gd2l0aCBkZWZhdWx0cyBmcm9tIHRoZW1lXG4gICAgW3sgZm9udDogZW1wdHlBcnJheS5zbGljZSgpIH1dLFxuICAgIFt7IGFsaWduOiBlbXB0eUFycmF5LnNsaWNlKCkgfV0sXG5cbiAgICBbJ2NsZWFuJ10sIC8vIHJlbW92ZSBmb3JtYXR0aW5nIGJ1dHRvblxuXG4gICAgWydsaW5rJywgJ2ltYWdlJywgJ3ZpZGVvJ10gLy8gbGluayBhbmQgaW1hZ2UsIHZpZGVvXG4gIF1cbn07XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4UXVpbGxDb21wb25lbnQgfSBmcm9tICcuL25neC1xdWlsbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4UXVpbGxDb25maWcgfSBmcm9tICcuL25neC1xdWlsbC5pbnRlcmZhY2VzJztcbmltcG9ydCB7IGRlZmF1bHRNb2R1bGVzIH0gZnJvbSAnLi9uZ3gtcXVpbGwuY29uc3RhbnRzJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtOZ3hRdWlsbENvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtOZ3hRdWlsbENvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6ICdjb25maWcnLFxuICAgICAgdXNlVmFsdWU6IGRlZmF1bHRNb2R1bGVzXG4gICAgfVxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hRdWlsbE1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZz86IE5neFF1aWxsQ29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBOZ3hRdWlsbE1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogJ2NvbmZpZycsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZyB8fCBkZWZhdWx0TW9kdWxlc1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9XG59XG5cblxuXG5cblxuIl0sIm5hbWVzIjpbIkluamVjdGFibGUiLCJFdmVudEVtaXR0ZXIiLCJTZWN1cml0eUNvbnRleHQiLCJpc1BsYXRmb3JtU2VydmVyIiwiQ29tcG9uZW50IiwiVmlld0VuY2Fwc3VsYXRpb24iLCJOR19WQUxVRV9BQ0NFU1NPUiIsImZvcndhcmRSZWYiLCJOR19WQUxJREFUT1JTIiwiRWxlbWVudFJlZiIsIkRvbVNhbml0aXplciIsIkluamVjdCIsIkRPQ1VNRU5UIiwiUExBVEZPUk1fSUQiLCJSZW5kZXJlcjIiLCJOZ1pvbmUiLCJJbnB1dCIsIk91dHB1dCIsIk5nTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7UUFPRTtTQUFpQjs7b0JBTGxCQSxhQUFVLFNBQUM7d0JBQ1YsVUFBVSxFQUFFLE1BQU07cUJBQ25COzs7Ozs4QkFKRDtLQVFDOzs7Ozs7QUNSRDs7UUFzQ0ksS0FBSyxHQUFRLElBQUk7QUFJckI7UUEyREUsMkJBQ1UsVUFBc0IsRUFDdEIsWUFBMEIsRUFDUixHQUFRLEVBRUwsVUFBa0IsRUFDdkMsUUFBbUIsRUFDbkIsSUFBWSxFQUNNLE1BQXNCO1lBUmxELGlCQW1CQztZQWxCUyxlQUFVLEdBQVYsVUFBVSxDQUFZO1lB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