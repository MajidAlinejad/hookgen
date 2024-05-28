/* eslint-disable no-async-promise-executor */
import {MethodIterator} from '../../../../../func/MethodIterator/index.ts';
import {typeMaker} from '../../../../../func/Typescript/TypeMaker/index.ts';
import {
  camelCase,
  typeNameSpaceMaker,
} from '../../../../../func/Typescript/TypeNameMaker/index.ts';
import {wrapNameSpace} from '../../../Declaration/declaration.ts';
import {
  ICreateAsyncResponseModelResult,
  createAsyncResponseModel,
} from './createAsyncResponseModel.ts';
import {methodHasResponseAsync} from '../Errors/methodHasErrorOrResAsync.mts';

export function CreateAsyncTypeResponse(
  itemName: string,
  method: MethodIterator,
  namespace: string
): Promise<string> {
  return new Promise(async resolve => {
    const response = await methodHasResponseAsync(method);
    if (response) {
      const res = await createAsyncResponseModel({
        response,
      });
      const data = getResponse(res, itemName, namespace);
      const file = wrapNameSpace(camelCase('Response'), data);
      resolve(file);
    } else {
      resolve('');
    }
  });
}

export function getResponse(
  res: ICreateAsyncResponseModelResult | null,
  name: string,
  namespace: string
) {
  if (res) {
    if (res.type === 'REF') {
      const value = typeNameSpaceMaker(res.response[0], namespace); //
      return typeMaker(name, value);
    } else {
      const value = res.response[0];
      return typeMaker(name, value);
    }
  } else {
    return '';
  }
}
