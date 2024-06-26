import {pathSplit} from '../../helper/index.ts';
import {camelCase} from '../../func/Typescript/TypeNameMaker/index.ts';
import {HttpMethodsUpperCase} from '../../types.ts';
import {IHooksTemplate} from './HooksTemplate.ts';
import {OpenAPIV3} from 'openapi-types';
import {configStore} from '../../config/index.ts';
const getResourcePicked = (value: string) => {
  if (configStore?.resourcePick) {
    return `Pick<${value},'${configStore?.resourcePick}'>['${configStore?.resourcePick}']`;
  } else {
    return value;
  }
};
export function ReactQueryTemplate({
  method,
  path,
  media: {description, deprecated, tags, summary, parameters},
}: IHooksTemplate) {
  const {definationName, scopeName, itemName} = pathSplit(path);
  if (!method) {
    return '';
  }

  const isPaging = parameters?.some(param =>
    (param as OpenAPIV3.ParameterObject).name.includes('PageNumber')
  );
  const name = camelCase(itemName);
  const methodName = camelCase(method) as HttpMethodsUpperCase;
  const tagName = camelCase(scopeName || tags?.[0] || '');

  const typeRoot = `${camelCase(definationName)}.${
    tagName ? tagName + '.' : ''
  }${methodName}`;
  const entityName = camelCase(method) + name;
  const requestType = `${typeRoot}.Request.`;
  const responseType = `${typeRoot}.Response.`;

  if (methodName === 'Get') {
    const query = getMethod(
      deprecated,
      description,
      summary,
      tags,
      name,
      methodName,
      path,
      entityName,
      responseType,
      requestType,
      tagName
    );
    const infinit = isPaging
      ? infiniteMethod(
          deprecated,
          description,
          summary,
          tags,
          name,
          methodName,
          path,
          entityName,
          responseType,
          requestType,
          tagName
        )
      : '';
    return query + infinit;
  } else
    return `\n/**
  ${deprecated ? '* @deprecated' : '* '}
   * ${description ? description : 'No description'}
   * @summary  ${summary}
   * @tags ${tags}
   * @name ${name}
   * @request ${methodName}:${path}
   
    ${deprecated ? '' : '*/ '}
 use${entityName} :(
	options?: Omit<UseMutationOptions<${getResourcePicked(
    `${responseType}${name}`
  )}, unknown,${requestType}${name} | undefined, unknown>, "mutationFn">,
  axiosOptions?: AxiosOpt,
) => {
	return useMutation((args)=>this.Api._${
    tagName ? tagName + '.' : ''
  }${entityName}(args,axiosOptions), options);
} ,
${deprecated ? '*/' : ' '}`;
}

function infiniteMethod(
  deprecated: boolean | undefined,
  description: string | undefined,
  summary: string | undefined,
  tags: string[] | undefined,
  name: string,
  methodName: string,
  path: string,
  entityName: string,
  responseType: string,
  requestType: string,
  tagName: string
) {
  return `
    \n/**
  ${deprecated ? '* @deprecated' : '* '}
   * ${description ? description : 'No description'}
   * @summary  ${summary}
   * @tags ${tags}
   * @name ${name}
   * @request ${methodName}:${path}
   ${deprecated ? '' : '*/ '}
   use${entityName}Infinit:<T = ${getResourcePicked(`${responseType}${name}`)}>(
	args: ${requestType}${name},
	options?:
		| Omit<
				UseInfiniteQueryOptions<${getResourcePicked(
          `${responseType}${name}`
        )}, unknown, T, ${getResourcePicked(
          `${responseType}${name}`
        )}, (string | ${requestType}${name})[]>,
				"queryFn" | "queryKey"
		  >
		| undefined,
  axiosOptions?: AxiosOpt,
) => {
	return useInfiniteQuery(['${
    tagName ? tagName + '.' : ''
  }${entityName}', args], ({ pageParam = 1 }) => this.Api._${
    tagName ? tagName + '.' : ''
  }${entityName}({ ...args, 
   params:{
              ...args.params,
              PageNumber: pageParam,
            }
  },  axiosOptions), options);
},
${deprecated ? '*/' : ' '}`;
}

function getMethod(
  deprecated: boolean | undefined,
  description: string | undefined,
  summary: string | undefined,
  tags: string[] | undefined,
  name: string,
  methodName: string,
  path: string,
  entityName: string,
  responseType: string,
  requestType: string,
  tagName: string
) {
  return `\n/**
  ${deprecated ? '* @deprecated' : '* '}
   * ${description ? description : 'No description'}
   * @summary  ${summary}
   * @tags ${tags}
   * @name ${name}
   * @request ${methodName}:${path}
     ${deprecated ? '' : '*/ '}
  use${entityName} : <T =  ${getResourcePicked(`${responseType}${name}`)}>(
	args:  ${requestType}${name},
	options?: Omit<UseQueryOptions<${getResourcePicked(
    `${responseType}${name}`
  )}, unknown, T, (string |${requestType}${name})[]>, "initialData" | "queryFn" | "queryKey">,
  axiosOptions?: AxiosOpt,
) => {
	return useQuery(['${
    tagName ? tagName + '.' : ''
  }${entityName}', args], () => this.Api._${
    tagName ? tagName + '.' : ''
  }${entityName}(args,axiosOptions), options);
},
  ${deprecated ? '*/' : ' '}`;
}
