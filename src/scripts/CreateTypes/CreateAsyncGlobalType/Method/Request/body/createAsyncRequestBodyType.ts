/* eslint-disable no-async-promise-executor */
import {OpenAPIV3} from 'openapi-types';
import {isReferenceOrRequestBody} from '../../../../../../types.ts';
import {contentMapper} from '../../../../../../func/contentMapper/index.ts';
import {
  AsyncRecursiveComponent,
  typeKey,
} from '../../../../CreateAsyncComponentType/AsyncRecursiveComponent.mts';
import {refrenceTreatAsync} from '../../../../CreateAsyncComponentType/refrenceTreatAsync.mts';

interface ICreateAsyncRequestBodyType {
  requestsBody?: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject;
}
export interface ICreateAsyncRequestBodyResultType {
  body: [string, string?];
  type: typeKey;
}
export function createAsyncRequestBodyType({
  requestsBody,
}: ICreateAsyncRequestBodyType) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<ICreateAsyncRequestBodyResultType | null>(
    async resolve => {
      if (requestsBody) {
        if (isReferenceOrRequestBody(requestsBody)) {
          const data = refrenceTreatAsync(requestsBody.$ref);
          resolve({body: [data], type: 'REF'});
        } else {
          const contentIterator = contentMapper(requestsBody.content);
          if (contentIterator?.length) {
            const data = await AsyncRecursiveComponent({
              component: contentIterator[0].objectContent.schema,
            });
            if (data) {
              if (
                contentIterator.some(cType =>
                  cType.objectName.includes('form-data')
                )
              ) {
                resolve({body: data.data, type: 'FORMDATA'});
              } else {
                resolve({body: data.data, type: data.type});
              }
            }
          }
        }
      }
      resolve(null);
    }
  );
}
