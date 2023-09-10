import {OpenAPIV3} from 'openapi-types';
type IContent = {
  [media: string]: OpenAPIV3.MediaTypeObject;
};

export function contentMapper(content: IContent | undefined) {
  if (!content) {
    return;
  }
  const entries = Object.entries(content);
  const object = entries.map(cur => {
    return {
      objectName: cur[0],
      objectContent: cur[1] as OpenAPIV3.MediaTypeObject,
    };
  });

  return object;
}
