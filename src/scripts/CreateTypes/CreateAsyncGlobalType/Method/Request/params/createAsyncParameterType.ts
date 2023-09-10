/* eslint-disable no-async-promise-executor */
import {OpenAPIV3} from 'openapi-types';
import {isReference, isReferenceOrParameter} from '../../../../../../types.ts';
import {peer} from '../../../../../../func/Typescript/peer/index.ts';
import {
  IAsyncRecursiveComponentResult,
  recursiveSchemaAsyncType,
} from '../../../../CreateAsyncComponentType/AsyncRecursiveComponent.mts';
import {typeNameMaker} from '../../../../../../func/Typescript/TypeNameMaker/index.ts';

interface ICreateAsyncParameterType {
  parameters?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[];
}
export function createAsyncParameterType({
  parameters,
}: ICreateAsyncParameterType) {
  return new Promise<string>(async resolve => {
    if (parameters) {
      const paramPromisses = parameters.map(async parameter => {
        return await getParamAsync(parameter);
      });
      const data = await Promise.all(paramPromisses);
      resolve(data.join(''));
    }
    resolve('');
  });
}

function getParamAsync(
  parameter: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject
): Promise<unknown> {
  return new Promise<string>(async resolve => {
    if (!isReferenceOrParameter(parameter)) {
      if (parameter.schema && parameter.in !== 'header') {
        if (!isReference(parameter.schema)) {
          const schemaData = await recursiveSchemaAsyncType(parameter.schema);
          const data = getRequest(schemaData, parameter.name);
          resolve(data);
        }
      }
    }
    resolve('');
  });
}

export function getRequest(
  req: IAsyncRecursiveComponentResult | null,
  name: string
) {
  if (req) {
    switch (req.type) {
      case 'REF':
        return peer(
          name,
          typeNameMaker(req?.data[0]),
          req.nullable,
          req.isArray
        );
      case 'ARRAY':
        return peer(
          name,
          typeNameMaker(req?.data[0]),
          req.nullable,
          req.isArray
        );
      case 'PREM':
        return peer(name, req?.data[0], req.nullable, req.isArray);

      default:
        return '';
    }
  } else {
    return '';
  }
}
