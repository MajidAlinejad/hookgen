import {OpenAPIV3} from 'openapi-types';
import {pathSplit} from '../../helper/index.ts';
import {camelCase} from '../../func/Typescript/TypeNameMaker/index.ts';
import {HttpMethodsUpperCase} from '../../types.ts';

interface SwrTemplate {
  path: string;
  method: string;
  media: OpenAPIV3.OperationObject;
}
export function SwrTemplate({
  method,
  path,
  media: {description, deprecated, tags, summary},
}: SwrTemplate) {
  const {definationName, scopeName, itemName} = pathSplit(path);
  if (!method) {
    return '';
  }
  const name = camelCase(itemName);
  const methodName = camelCase(method) as HttpMethodsUpperCase;
  const tagName = scopeName || tags?.[0] || '';

  const typeRoot = `${camelCase(definationName)}.${
    tagName ? tagName + '.' : ''
  }${methodName}`;
  const entityName = camelCase(method) + name;
  const requestType = `${typeRoot}.Request.`;
  const responseType = `${typeRoot}.Response.`;
  if (methodName === 'Get') {
    return `\n/**
  ${deprecated ? '* @deprecated' : '* '}
   * ${description ? description : 'No description'}
   * @summary  ${summary}
   * @tags ${tags}
   * @name ${name}
   * @request ${methodName}:${path}
   */
    use${entityName} :(
        options?: Partial<PublicConfiguration<
        ${responseType}${name},
        unknown,
        any
      >>
       )=> {
        return useSWR(['${tagName ? tagName + '.' : ''}${entityName}'],
       this.Api._${tagName ? tagName + '.' : ''}${entityName},options
      );
  },`;
  } else
    return `\n/**
  ${deprecated ? '* @deprecated' : '* '}
   * ${description ? description : 'No description'}
   * @summary  ${summary}
   * @tags ${tags}
   * @name ${name}
   * @request ${methodName}:${path}
   */
       use${entityName} :(
        options?: SWRMutationConfiguration<
        ${responseType}${name},
        unknown,
        string[],
        ${requestType}${name},
        any
      >
       )=> {
        return useSWRMutation<
       ${responseType}${name},
        unknown,
        string[],
        ${requestType}${name}
      >(['${tagName ? tagName + '.' : ''}${entityName}'], (key, {arg}) =>
       this.Api._${tagName ? tagName + '.' : ''}${entityName}(arg),options
      );

  },`;
}
