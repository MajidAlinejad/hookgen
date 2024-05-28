/* eslint-disable no-async-promise-executor */
import {MethodIterator} from '../../../../func/MethodIterator/index.ts';
import {wrapNameSpace} from '../../Declaration/declaration.ts';
import {CreateAsyncTypeRequest} from './Request/CreateAsyncTypeRequest.ts';
import {CreateAsyncTypeError} from './Errors/CreateAsyncTypeError.mts';
import {CreateAsyncTypeResponse} from './Response/CreateAsyncTypeResponse.ts';

export function CreateAsyncTypeMethod(
  method: MethodIterator,
  itemName: string,
  namespace: string
): Promise<string> {
  return new Promise(async resolve => {
    const Request = await CreateAsyncTypeRequest(itemName, method, namespace);
    const Response = await CreateAsyncTypeResponse(itemName, method, namespace);
    const Error = await CreateAsyncTypeError(itemName, method, namespace);
    const data = Request + Response + Error;
    const file = wrapNameSpace(method.objectName.toLowerCase(), data);
    resolve(file);
  });
}
