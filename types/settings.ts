export type SettingValue = string | number | boolean | null | string[] | Record<string, unknown>[]
export type SettingFieldType = 'text'|'textarea'|'number'|'switch'|'select'|'color'|'media'|'url'|'repeater'|'product-spec-priority'|'home-videos'
export interface SettingFieldDefinition { key:string; label:string; type:SettingFieldType; description?:string; options?:{label:string;value:string}[]; min?:number; max?:number }
export interface SettingsTabDefinition { slug:string; group:string; title:string; description:string; previewUrl?:string; fields:SettingFieldDefinition[] }
export interface PageSectionItemInput {id?:string;title?:string|null;description?:string|null;value?:string|null;suffix?:string|null;icon?:string|null;imageId?:string|null;buttonLabel?:string|null;buttonUrl?:string|null;isEnabled:boolean;sortOrder:number}
