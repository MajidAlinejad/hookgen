import {OpenAPIV3} from 'openapi-types';
import {isReferenceOrResponse} from '../../../../../types.ts';
import {contentMapper} from '../../../../../func/contentMapper/index.ts';
import {
  AsyncRecursiveComponent,
  typeKey,
} from '../../../CreateAsyncComponentType/AsyncRecursiveComponent.mts';

export interface ICreateAsyncResponseModel {
  response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject;
}

export interface ICreateAsyncResponseModelResult {
  type: typeKey;
  response: [string, string?];
}

export function createAsyncResponseModel({
  response,
}: ICreateAsyncResponseModel) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<ICreateAsyncResponseModelResult | null>(async resolve => {
    if (response) {
      if (!isReferenceOrResponse(response)) {
        const contentIterator = contentMapper(response.content);
        if (contentIterator?.length) {
          const data = await AsyncRecursiveComponent({
            component: contentIterator[0].objectContent.schema,
          });
          if (data) {
            resolve({type: data.type, response: data.data});
          }
        }
      }
    }
    resolve(null);
  });
}
