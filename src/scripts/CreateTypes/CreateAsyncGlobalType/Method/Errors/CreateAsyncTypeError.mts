import {MethodIterator} from '../../../../../func/MethodIterator/index.ts';
import {camelCase} from '../../../../../func/Typescript/TypeNameMaker/index.ts';
import {wrapNameSpace} from '../../../Declaration/declaration.ts';
import {getResponse} from '../Response/CreateAsyncTypeResponse.ts';
import {createAsyncResponseModel} from '../Response/createAsyncResponseModel.ts';
import {methodHasErrorAsync} from './methodHasErrorOrResAsync.mts';

export function CreateAsyncTypeError(
  itemName: string,
  method: MethodIterator
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const error = await methodHasErrorAsync(method);
    if (error) {
      const err = await createAsyncResponseModel({
        response: error,
      });
      const data = getResponse(err, itemName);
      const file = wrapNameSpace(camelCase('Error'), data);
      resolve(file);
    } else {
      resolve('');
    }
  });
}
