/* eslint-disable no-async-promise-executor */
import {MethodIterator} from '../../../../../func/MethodIterator/index.ts';
import {typeMaker} from '../../../../../func/Typescript/TypeMaker/index.ts';
import {
  camelCase,
  typeNameMaker,
} from '../../../../../func/Typescript/TypeNameMaker/index.ts';
import {wrapNameSpace} from '../../../Declaration/declaration.ts';
import {
  ICreateAsyncResponseModelResult,
  createAsyncResponseModel,
} from './createAsyncResponseModel.ts';
import {methodHasResponseAsync} from '../Errors/methodHasErrorOrResAsync.mts';

export function CreateAsyncTypeResponse(
  itemName: string,
  method: MethodIterator
): Promise<string> {
  return new Promise(async resolve => {
    const response = await methodHasResponseAsync(method);
    if (response) {
      const res = await createAsyncResponseModel({
        response,
      });
      const data = getResponse(res, itemName);
      const file = wrapNameSpace(camelCase('Response'), data);
      resolve(file);
    } else {
      resolve('');
    }
  });
}

export function getResponse(
  res: ICreateAsyncResponseModelResult | null,
  name: string
) {
  if (res) {
    return res.type === 'REF'
      ? typeMaker(name, typeNameMaker(res.response[0]))
      : '{' + typeMaker(name, res.response[0]) + '}';
  } else {
    return '';
  }
}
