export type NgxQuillToolbarConfig = Array<Array<string | {
    indent?: string
    list?: string
    direction?: string
    header?: number | Array<boolean | number>
    color?: string[]
    background?: string[]
    align?: string[]
    script?: string
    font?: string[]
    size?: Array<boolean | string>
  }
>>;

export interface NgxQuillModules {
  toolbar: NgxQuillToolbarConfig;
}

export interface NgxQuillConfig {
  modules?: NgxQuillModules;
}

export interface CustomOption {
  import: string;
  whitelist: any[];
}
