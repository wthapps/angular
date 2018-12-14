import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxQuillComponent } from './ngx-quill.component';
import { NgxQuillConfig } from './ngx-quill.interfaces';
import { defaultModules } from './ngx-quill.constants';

@NgModule({
  imports: [
  ],
  declarations: [NgxQuillComponent],
  exports: [NgxQuillComponent],
  providers: [
    {
      provide: 'config',
      useValue: defaultModules
    }
  ],
})
export class NgxQuillModule {
  static forRoot(config?: NgxQuillConfig): ModuleWithProviders {
    return {
      ngModule: NgxQuillModule,
      providers: [
        {
          provide: 'config',
          useValue: config || defaultModules
        }
      ]
    }
  }
}





