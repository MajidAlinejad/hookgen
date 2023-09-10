import {OpenAPIV3} from 'openapi-types';
import {MethodIterator} from '../../func/MethodIterator/index.ts';
import {capitalize, pathSplit} from '../../helper/index.ts';
import {camelCase} from '../../func/Typescript/TypeNameMaker/index.ts';
let openedScope: string | undefined = undefined;

interface IApiTemplate {
  path: string;
  method: string;
  media: OpenAPIV3.OperationObject;
}
type PathItemObject = OpenAPIV3.PathItemObject;
export function fetcherTemplate({
  objectName,
  objectPath,
  index,
  len,
}: {
  objectName: string;
  objectPath: PathItemObject;
  index: number;
  len: number;
}) {
  const {scopeName} = pathSplit(objectName);
  const iteratedMathods = MethodIterator(objectPath);
  const tagName =
    scopeName || iteratedMathods?.[0].objectMethod.tags?.[0] || '_NO_TAG';
  const apis = iteratedMathods
    ?.map(method => {
      return apiTemplate({
        method: method.objectName,
        path: objectName,
        media: method.objectMethod,
      });
    })
    .join('');

  if (openedScope !== tagName) {
    const result =
      index === 0
        ? '_' + tagName + ':{' + apis
        : ' \n}, \n _' + tagName + ':{' + apis;
    openedScope = tagName;

    return index + 1 === len ? result + '}, ' : result;
  } else {
    return index + 1 === len ? apis + '}, ' : apis;
  }
}
const getContentBody = (
  requestBody: OpenAPIV3.RequestBodyObject | undefined
) => {
  if (requestBody !== undefined && requestBody.content !== undefined) {
    if (Object.keys(requestBody.content).some(item => item.includes('json'))) {
      return 'Json';
    } else if (
      Object.keys(requestBody.content).some(item => item.includes('form-data'))
    ) {
      return 'FormData';
    } else if (
      Object.keys(requestBody.content).some(item => item.includes('text/plain'))
    ) {
      return 'Text';
    } else if (
      Object.keys(requestBody.content).some(item =>
        item.includes('url-encoded')
      )
    ) {
      return 'UrlEncoded';
    }
    return 'Json';
  }
  return 'Json';
};

export function apiTemplate({
  method,
  path,
  media: {description, deprecated, tags, summary, requestBody},
}: IApiTemplate) {
  const {definationName, scopeName, itemName} = pathSplit(path);
  if (!method) {
    return '';
  }

  const tagName = scopeName || tags?.[0] || '';
  const typeRoot = `${camelCase(definationName)}.${
    tagName ? tagName + '.' : ''
  }${capitalize(method)}`;
  const name = camelCase(itemName);
  const requestType = `${typeRoot}.Request.`;
  const responseType = `${typeRoot}.Response.`;
  return `\n/**
  ${deprecated ? '* @deprecated' : '* '}
   * ${description ? description : 'No description'}
   * @summary  ${summary}
   * @tags ${tags}
   * @name ${name}
   * @request ${capitalize(method)}:${path}
   */
   ${
     camelCase(method) + name
   } :async ({data, params,header}:${requestType}${name}) => {
     const {data: axiosData} = await this.request<${responseType}${name}, ${requestType}${name}>({
      path: \`${path.replace('{', '${params?.')}\`,
      method: '${capitalize(method)}',
      body: getData(data),
      type: ContentType.${getContentBody(
        requestBody as OpenAPIV3.RequestBodyObject
      )},
      format: 'json',
      query:{...getData(params),...header},
    });
     return axiosData; 
  },`;
}
