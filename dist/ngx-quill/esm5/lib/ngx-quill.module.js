/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { NgxQuillComponent } from './ngx-quill.component';
import { defaultModules } from './ngx-quill.constants';
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
export { NgxQuillModule };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXF1aWxsLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0B3dGhhcHBzL25neC1xdWlsbC8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtcXVpbGwubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7U0FVdkMsY0FBYztBQVI5QjtJQUFBO0lBd0JBLENBQUM7Ozs7O0lBWFEsc0JBQU87Ozs7SUFBZCxVQUFlLE1BQXVCO1FBQ3BDLE9BQU87WUFDTCxRQUFRLEVBQUUsY0FBYztZQUN4QixTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLFFBQVE7b0JBQ2pCLFFBQVEsRUFBRSxNQUFNLElBQUksY0FBYztpQkFDbkM7YUFDRjtTQUNGLENBQUE7SUFDSCxDQUFDOztnQkF2QkYsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRSxFQUNSO29CQUNELFlBQVksRUFBRSxDQUFDLGlCQUFpQixDQUFDO29CQUNqQyxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDNUIsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxRQUFROzRCQUNqQixRQUFRLElBQWdCO3lCQUN6QjtxQkFDRjtpQkFDRjs7SUFhRCxxQkFBQztDQUFBLEFBeEJELElBd0JDO1NBWlksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ3hRdWlsbENvbXBvbmVudCB9IGZyb20gJy4vbmd4LXF1aWxsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hRdWlsbENvbmZpZyB9IGZyb20gJy4vbmd4LXF1aWxsLmludGVyZmFjZXMnO1xuaW1wb3J0IHsgZGVmYXVsdE1vZHVsZXMgfSBmcm9tICcuL25neC1xdWlsbC5jb25zdGFudHMnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW05neFF1aWxsQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05neFF1aWxsQ29tcG9uZW50XSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogJ2NvbmZpZycsXG4gICAgICB1c2VWYWx1ZTogZGVmYXVsdE1vZHVsZXNcbiAgICB9XG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE5neFF1aWxsTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoY29uZmlnPzogTmd4UXVpbGxDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IE5neFF1aWxsTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiAnY29uZmlnJyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnIHx8IGRlZmF1bHRNb2R1bGVzXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH1cbn1cblxuXG5cblxuXG4iXX0=