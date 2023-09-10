/* eslint-disable no-async-promise-executor */
import {OpenAPIV3} from 'openapi-types';
import {isReference, isReferenceOrParameter} from '../../../../../../types.ts';
import {peer} from '../../../../../../func/Typescript/peer/index.ts';
import {recursiveSchemaAsyncType} from '../../../../CreateAsyncComponentType/AsyncRecursiveComponent.mts';
interface ICreateAsyncHeaderType {
  parameters?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[];
}
export function createAsyncHeaderType({parameters}: ICreateAsyncHeaderType) {
  return new Promise<string>(async resolve => {
    if (parameters) {
      const paramPromisses = parameters.map(async parameters => {
        return await getHeaderParamAsync(parameters);
      });
      const data = await Promise.all(paramPromisses);
      resolve(data.join(''));
    }
    resolve('');
  });
}

function getHeaderParamAsync(
  parameters: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject
): Promise<string> {
  return new Promise<string>(async resolve => {
    if (!isReferenceOrParameter(parameters)) {
      if (parameters.schema && parameters.in === 'header') {
        if (!isReference(parameters.schema)) {
          const schemaData = await recursiveSchemaAsyncType(parameters.schema);
          if (schemaData) {
            const data = peer(
              parameters.name,
              schemaData?.data[0],
              schemaData.nullable,
              schemaData.isArray
            );
            resolve(data);
          }
        }
      }
    }
    resolve('');
  });
}
