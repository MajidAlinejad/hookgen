/* eslint-disable no-async-promise-executor */
import {MethodIterator} from '../../../../../func/MethodIterator/index.ts';
import {interfaceMaker} from '../../../../../func/Typescript/InterfaceMaker/index.ts';
import {
  camelCase,
  typeNameMaker,
} from '../../../../../func/Typescript/TypeNameMaker/index.ts';
import {wrapNameSpace} from '../../../Declaration/declaration.ts';
import {peer} from '../../../../../func/Typescript/peer/index.ts';
import {createAsyncHeaderType} from './params/createAsyncHeaderType.ts';
import {createAsyncParameterType} from './params/createAsyncParameterType.ts';
import {
  ICreateAsyncRequestBodyResultType,
  createAsyncRequestBodyType,
} from './body/createAsyncRequestBodyType.ts';

export function CreateAsyncTypeRequest(
  itemName: string,
  method: MethodIterator
): Promise<string> {
  return new Promise(async resolve => {
    const params = await createAsyncParameterType({
      parameters: method.objectMethod.parameters,
    });
    const header = await createAsyncHeaderType({
      parameters: method.objectMethod.parameters,
    });
    const requestBody = await createAsyncRequestBodyType({
      requestsBody: method.objectMethod.requestBody,
    });

    const paramValue = params ? peer('params', '{' + params + '}') : '';
    const headerValue = header ? peer('header', '{' + header + '}', true) : '';
    const bodyValue = requestBodys(requestBody);
    const data = interfaceMaker(
      itemName,
      paramValue + headerValue + bodyValue,
      'ICOMMNON'
    );
    const file = wrapNameSpace(camelCase('Request'), data);
    resolve(file);
  });
}

function requestBodys(requestBody: ICreateAsyncRequestBodyResultType | null) {
  if (requestBody) {
    switch (requestBody.type) {
      case 'REF':
        return peer('data', typeNameMaker(requestBody.body[0]));
      case 'PREM':
        return peer('data', requestBody.body[0]);
      case 'ARRAY':
        return peer('data', requestBody.body[0]);
      case 'MEDIA':
        return peer('data', '{' + requestBody.body[0] + '}');
      default:
        return '';
    }
  } else {
    return '';
  }
}
