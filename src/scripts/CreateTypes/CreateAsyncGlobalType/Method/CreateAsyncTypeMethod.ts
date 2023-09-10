/* eslint-disable no-async-promise-executor */
import {MethodIterator} from '../../../../func/MethodIterator/index.ts';
import {wrapNameSpace} from '../../Declaration/declaration.ts';
import {CreateAsyncTypeRequest} from './Request/CreateAsyncTypeRequest.ts';
import {CreateAsyncTypeError} from './Errors/CreateAsyncTypeError.mts';
import {CreateAsyncTypeResponse} from './Response/CreateAsyncTypeResponse.ts';

export function CreateAsyncTypeMethod(
  method: MethodIterator,
  itemName: string
): Promise<string> {
  return new Promise(async resolve => {
    const Request = await CreateAsyncTypeRequest(itemName, method);
    const Response = await CreateAsyncTypeResponse(itemName, method);
    const Error = await CreateAsyncTypeError(itemName, method);
    const data = Request + Response + Error;
    const file = wrapNameSpace(method.objectName.toLowerCase(), data);
    resolve(file);
  });
}
