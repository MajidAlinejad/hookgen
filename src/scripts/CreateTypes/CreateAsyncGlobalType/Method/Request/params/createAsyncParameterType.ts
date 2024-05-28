/* eslint-disable no-async-promise-executor */
import {OpenAPIV3} from 'openapi-types';
import {isReference, isReferenceOrParameter} from '../../../../../../types.ts';
import {peer} from '../../../../../../func/Typescript/peer/index.ts';
import {
  IAsyncRecursiveComponentResult,
  recursiveSchemaAsyncType,
} from '../../../../CreateAsyncComponentType/AsyncRecursiveComponent.mts';
import {
  typeNameMaker,
  typeNameSpaceMaker,
} from '../../../../../../func/Typescript/TypeNameMaker/index.ts';
import {refrenceTreatAsync} from '../../../../CreateAsyncComponentType/refrenceTreatAsync.mts';

interface ICreateAsyncParameterType {
  parameters?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[];
  namespace?: string;
}
export function createAsyncParameterType({
  parameters,
  namespace,
}: ICreateAsyncParameterType) {
  return new Promise<string>(async resolve => {
    if (parameters) {
      const paramPromisses = parameters.map(async parameter => {
        return await getParamAsync(parameter, namespace);
      });
      const data = await Promise.all(paramPromisses);
      resolve(data.join(''));
    }
    resolve('');
  });
}

function getParamAsync(
  parameter: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject,
  namespace?: string
): Promise<unknown> {
  return new Promise<string>(async resolve => {
    if (!isReferenceOrParameter(parameter)) {
      if (parameter.schema && parameter.in !== 'header') {
        if (!isReference(parameter.schema)) {
          const schemaData = await recursiveSchemaAsyncType(parameter.schema);
          const data = getRequest(schemaData, parameter.name);
          resolve(data);
        } else {
          const res = refrenceTreatAsync(parameter.schema.$ref);
          const data = getRequest(
            {data: [res], type: 'REF'},
            parameter.name,
            namespace
          );
          resolve(data);
        }
      }
    }
    resolve('');
  });
}

export function getRequest(
  req: IAsyncRecursiveComponentResult | null,
  name: string,
  namespace?: string
) {
  if (req) {
    switch (req.type) {
      case 'REF':
        return peer(
          name,
          typeNameSpaceMaker(req?.data[0], namespace as string),
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
