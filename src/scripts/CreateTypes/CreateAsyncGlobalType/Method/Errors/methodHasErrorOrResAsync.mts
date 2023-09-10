import {OpenAPIV3} from 'openapi-types';
import {MethodIterator} from '../../../../../func/MethodIterator/index.ts';
import {responsesMapper} from '../../../../../func/responsesMapper/index.ts';
import {statusString} from '../../../../../helper/index.ts';

export function methodHasResponseAsync(method: MethodIterator) {
  return new Promise<
    (OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject) | false
  >((resolve, reject) => {
    const responseIterator = responsesMapper(method.objectMethod.responses);
    const hasOk = responseIterator?.some(({objectName}) => {
      const status = statusString(objectName);
      return status === 'Ok' ? true : false;
    });
    if (hasOk) {
      const response = responseIterator?.find(item => item.objectName === '200')
        ?.objectResponse as
        | OpenAPIV3.ReferenceObject
        | OpenAPIV3.ResponseObject;
      resolve(response);
    }
    resolve(false);
  });
}
export function methodHasErrorAsync(method: MethodIterator) {
  return new Promise<
    (OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject) | false
  >((resolve, reject) => {
    const responseIterator = responsesMapper(method.objectMethod.responses);
    const hasBad = responseIterator?.some(({objectName}) => {
      const status = statusString(objectName);
      return status === 'Bad' ? true : false;
    });
    if (hasBad) {
      const response = responseIterator?.find(item => item.objectName === '400')
        ?.objectResponse as
        | OpenAPIV3.ReferenceObject
        | OpenAPIV3.ResponseObject;
      resolve(response);
    }
    resolve(false);
  });
}
