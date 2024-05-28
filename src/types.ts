import {Options} from 'prettier';
import {Agent} from 'https';
import {OpenAPIV3} from 'openapi-types';
import {Ora} from 'ora';

export type Spec = OpenAPIV3.Document;
export interface IGetFromSwaggerRootHtml {
  /**
   * Get Root url of swagger and get list of scopes jsons.
   *
   * @param baseUrl - YOUR_BASE_URL
   */
  baseUrl: string;
  sslConfiguredAgent?: Agent;
}
export interface IGetSwaggerDefenitions {
  requests: string[];
  sslConfiguredAgent?: Agent;
}

export interface ISwaggerRootHtml {
  urls: URL[];
  deepLinking: boolean;
  persistAuthorization: boolean;
  displayOperationId: boolean;
  defaultModelsExpandDepth: number;
  defaultModelExpandDepth: number;
  defaultModelRendering: string;
  displayRequestDuration: boolean;
  docExpansion: string;
  showExtensions: boolean;
  showCommonExtensions: boolean;
  supportedSubmitMethods: string[];
}

export interface URL {
  url: string;
  name: string;
}
export type fileTypes = 'mts' | 'ts' | 'd.ts' | 'md' | 'tsx';
export enum fileTypesEnum {
  enums = 'enums',
  types = 'types',
  client = 'client',
  api = 'api',
  hook = 'hook',
}
export interface IConfig {
  baseUrl: string;
  outDir: string;
  archive?: boolean;
  prettier?: Options;
  resourcePick?: string;
  filter?: RegExp;
  singleJson?: boolean;
  hook?: 'SWR' | 'ReactQuery' | 'NG';
  fileTypes?: {[key in fileTypesEnum]: fileTypes};
}

export interface ISaveFile {
  fileName: string;
  location: string;
  data: unknown;
  extention?: string;
  beautify?: boolean;
  comment?: string;
}
export interface ISaveBatch {
  files: {name: string; data: string; extention?: string; comment?: string}[];
  location: string;
  beautify?: boolean;
  extention?: string;
}
export type IOpenApiComponent =
  | OpenAPIV3.ReferenceObject
  | OpenAPIV3.SchemaObject;
export type ComponentSchema =
  | {
      objectName: string;
      objectSchema: IOpenApiComponent;
    }[]
  | undefined;

export interface ICreateComponentSchemas {}

export function isReference(
  schemaObject: IOpenApiComponent
): schemaObject is OpenAPIV3.ReferenceObject {
  return (schemaObject as OpenAPIV3.ReferenceObject).$ref !== undefined;
}

export function isArraySchemaObject(
  schemaObject: OpenAPIV3.ArraySchemaObject | OpenAPIV3.NonArraySchemaObject
): schemaObject is OpenAPIV3.ArraySchemaObject {
  return (schemaObject as OpenAPIV3.ArraySchemaObject).items !== undefined;
}

export interface Spins {
  id?: string;
  spinner: Ora;
}

export interface IRecursiveArraySchema {
  /*
  *
  * @example:  properties?: {
            [name: string]: ReferenceObject | SchemaObject;
        };
  */
  component: OpenAPIV3.SchemaObject;
  name: string;
}
export interface IRecursiveComponentSchema {
  /*
  *
  * @example:  properties?: {
            [name: string]: ReferenceObject | SchemaObject;
        };
  */
  component?: IOpenApiComponent;
  name: string;
}

export function isReferenceOrParameter(
  object: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject
): object is OpenAPIV3.ReferenceObject {
  return (object as OpenAPIV3.ReferenceObject).$ref !== undefined;
}

export interface ICreateParameter {
  parameters?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[];
  pathName: string;
  methodType: string;
}

export function isReferenceOrRequestBody(
  object: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject
): object is OpenAPIV3.ReferenceObject {
  return (object as OpenAPIV3.ReferenceObject).$ref !== undefined;
}
export function isReferenceOrResponse(
  object: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject
): object is OpenAPIV3.ReferenceObject {
  return (object as OpenAPIV3.ReferenceObject).$ref !== undefined;
}

export interface ICreateRequestBody {
  requestBody?: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject;
  pathName: string;
  methodType: string;
}

export interface ICreateResponse {
  response: OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject;
  pathName: string;
  methodType: string;
  status: 'Ok' | 'Bad';
}

export type ISchema = {[key: string]: IOpenApiComponent};

export type HttpMethodsUpperCase =
  | 'Get'
  | 'Put'
  | 'Post'
  | 'Delete'
  | 'Options'
  | 'Head'
  | 'Patch';

export function isInterfaceEmpty(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: {} | {[key: string]: any}
): object is {} {
  return Object.keys(object as {}).length === 0;
}
