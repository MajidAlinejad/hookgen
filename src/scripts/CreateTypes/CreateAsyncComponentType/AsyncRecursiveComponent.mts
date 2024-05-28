import {OpenAPIV3} from 'openapi-types';
import {
  IOpenApiComponent,
  isArraySchemaObject,
  isReference,
} from '../../../types.ts';
import {schemaIterator} from '../../../func/SchemaMapper/index.ts';
import {getEnumAsyncType} from './getEnumAsyncType.mts';
import {getPremitiveAsyncType} from './getPremitiveAsyncType.mts';
import {refrenceTreatAsync} from './refrenceTreatAsync.mts';
import {warnComponent} from './warnComponent.mts';
import {componentMediaOrRef} from './componentMediaOrRef.mts';

export interface IAsyncRecursiveComponent {
  component: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;
  name?: string;
  firstLvl?: boolean;
}
export interface IAsyncRecursiveSchema {
  component: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;
  name: string;
}

export type typeKey =
  | 'REF'
  | 'MEDIA'
  | 'ENUM'
  | 'PREM'
  | 'ARRAY'
  | 'MEDIA_TYPE'
  | 'FORMDATA'
  | 'COM_PREM'
  | 'RECORD';

export interface IAsyncRecursiveComponentResult {
  data: [string, string?];
  name?: string;
  type: typeKey;
  nullable?: boolean;
  isArray?: boolean;
}
export function AsyncRecursiveComponent({
  component,
  name,
  firstLvl = false,
}: IAsyncRecursiveComponent) {
  return new Promise<IAsyncRecursiveComponentResult | null>(async resolve => {
    if (component) {
      if (isReference(component)) {
        const type = refrenceTreatAsync(component.$ref);
        resolve({data: [type], type: 'REF', name});
      } else {
        if (component.type === undefined) {
          warnComponent(name as string);
          resolve({
            data: ['unknown'],
            type: 'MEDIA_TYPE',
            name,
            nullable: component.nullable,
          });
        } else {
          const data = await recursiveSchemaAsyncType(
            component,
            name,
            firstLvl
          );
          resolve({...(data as IAsyncRecursiveComponentResult), name});
        }
      }
    } else {
      resolve(null);
    }
  });
}

export async function recursiveSchemaAsyncType(
  component: OpenAPIV3.SchemaObject,
  name?: string,
  firstLvl = false
) {
  return new Promise<IAsyncRecursiveComponentResult | null>(
    async (resolve, reject) => {
      if (isArraySchemaObject(component)) {
        const data = await AsyncRecursiveComponent({
          component: component.items,
          name: name,
        });
        resolve({
          ...(data as IAsyncRecursiveComponentResult),
          nullable: component.nullable,
          isArray: true,
        });
      } else {
        if (component.type === 'object') {
          if (component.properties) {
            const data = await ObjectSchemaAsyncComponents(
              component.properties
            );
            resolve({
              data: [data],
              type: 'MEDIA',
              nullable: component.nullable,
              name: name,
            });
          } else if (component.additionalProperties !== undefined) {
            const data = await ObjectSchemaAsyncComponentsAditional(
              component.additionalProperties,
              name
            );
            resolve({
              ...(data as IAsyncRecursiveComponentResult),
              type: 'RECORD',
              nullable: component.nullable,
              name: name,
            });
          } else {
            warnComponent(name as string);
            resolve({
              data: ['unknown'],
              type: 'MEDIA_TYPE',
              nullable: component.nullable,
              name: name,
            });
          }
        } else {
          if (!component.enum) {
            const premitive = await getPremitiveAsyncType(component.type);

            resolve({
              data: [premitive],
              type: firstLvl ? 'COM_PREM' : 'PREM',
              name: name,
              nullable: component.nullable,
            });
          } else {
            const enums = await getEnumAsyncType(component.enum);
            resolve({
              data: enums,
              type: 'ENUM',
              nullable: component.nullable,
              name: name,
            });
          }
        }
      }
    }
  );
}
function ObjectSchemaAsyncComponents(
  properties: Pick<OpenAPIV3.BaseSchemaObject, 'properties'>['properties']
) {
  return new Promise<string>(async (resolve, reject) => {
    const IteratedProperties = schemaIterator(properties);
    const propertiesPromisses = IteratedProperties?.map(
      async ({objectName, objectSchema}) => {
        return await AsyncRecursiveSchema({
          component: objectSchema,
          name: objectName,
        });
      }
    );

    if (propertiesPromisses) {
      const data = await Promise.all(propertiesPromisses);
      resolve(data.join(''));
    }
  });
}
function ObjectSchemaAsyncComponentsAditional(
  properties: Pick<
    OpenAPIV3.BaseSchemaObject,
    'additionalProperties'
  >['additionalProperties'],
  name?: string
) {
  return new Promise<IAsyncRecursiveComponentResult | null>(async resolve => {
    if (properties !== undefined) {
      if (typeof properties === 'boolean') {
        resolve({
          type: 'MEDIA_TYPE',
          data: ['boolean'],
          name: name,
          nullable: true,
        });
      } else if (!isReference(properties as IOpenApiComponent)) {
        const result = await recursiveSchemaAsyncType(
          properties as OpenAPIV3.SchemaObject,
          name
        );
        resolve(result);
      }
    }
    resolve(null);
  });
}

export function AsyncRecursiveSchema({component, name}: IAsyncRecursiveSchema) {
  return new Promise<string | null>(async resolve => {
    if (component) {
      if (isReference(component)) {
        const type = refrenceTreatAsync(component.$ref);
        const data = componentMediaOrRef({data: [type], type: 'REF', name});
        resolve(data);
      } else {
        if (component.type === undefined) {
          warnComponent(name);
          const data = componentMediaOrRef({
            data: ['unknown'],
            type: 'PREM',
            nullable: component.nullable,
            name,
          });
          resolve(data);
        } else {
          const result = await recursiveSchemaAsyncType(component, name);
          const data = componentMediaOrRef(result);
          resolve(data);
        }
      }
    } else {
      resolve(null);
    }
  });
}
