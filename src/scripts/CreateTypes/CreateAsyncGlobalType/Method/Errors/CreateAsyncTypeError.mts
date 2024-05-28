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
} from '../Response/createAsyncResponseModel.ts';
import {methodHasErrorAsync} from './methodHasErrorOrResAsync.mts';

export function CreateAsyncTypeError(
  itemName: string,
  method: MethodIterator,
  namespace: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const error = await methodHasErrorAsync(method);
    if (error) {
      const err = await createAsyncResponseModel({
        response: error,
      });
      const data = getError(err, itemName, namespace);
      const file = wrapNameSpace(camelCase('Error'), data);
      resolve(file);
    } else {
      resolve('');
    }
  });
}

export function getError(
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
