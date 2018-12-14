import { DomSanitizer } from '@angular/platform-browser';
import { AfterViewInit, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, Validator } from '@angular/forms';
import { CustomOption, NgxQuillConfig, NgxQuillModules } from './ngx-quill.interfaces';
export declare class NgxQuillComponent implements AfterViewInit, ControlValueAccessor, OnChanges, OnDestroy, Validator {
    private elementRef;
    private domSanitizer;
    private doc;
    private platformId;
    private renderer;
    private zone;
    private config;
    quillEditor: any;
    editorElem: HTMLElement;
    emptyArray: any[];
    content: any;
    selectionChangeEvent: any;
    textChangeEvent: any;
    defaultModules: NgxQuillModules | {};
    onModelChange: any;
    onModelTouched: any;
    format: 'object' | 'html' | 'text' | 'json';
    theme: string;
    modules: {
        [index: string]: Object;
    } | null;
    readOnly: boolean;
    placeholder: string;
    maxLength: number | null;
    minLength: number | null;
    required: boolean;
    formats: string[] | null;
    sanitize: boolean;
    style: any;
    strict: boolean;
    scrollingContainer: HTMLElement | string | null;
    bounds: HTMLElement | string;
    customOptions: CustomOption[];
    onEditorCreated: EventEmitter<any>;
    onContentChanged: EventEmitter<any>;
    onSelectionChanged: EventEmitter<any>;
    private disabled;
    constructor(elementRef: ElementRef, domSanitizer: DomSanitizer, doc: any, platformId: Object, renderer: Renderer2, zone: NgZone, config: NgxQuillConfig);
    valueGetter: (quillEditor: any, editorElement: HTMLElement) => any;
    valueSetter: (quillEditor: any, value: any) => any;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    writeValue(currentValue: any): void;
    setDisabledState(isDisabled?: boolean): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    validate(): {
        minLengthError?: {
            given: number;
            minLength: number;
        };
        maxLengthError?: {
            given: number;
            maxLength: number;
        };
        requiredError?: {
            empty: boolean;
        };
    };
}
