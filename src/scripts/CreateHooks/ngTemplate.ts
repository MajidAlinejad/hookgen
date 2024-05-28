import {pathSplit} from '../../helper/index.ts';
import {camelCase} from '../../func/Typescript/TypeNameMaker/index.ts';
import {HttpMethodsUpperCase} from '../../types.ts';
import {IHooksTemplate} from './HooksTemplate.ts';
import {OpenAPIV3} from 'openapi-types';
import {configStore} from '../../config/index.ts';
const getResourcePicked = (value: string) => {
  if (configStore?.resourcePick) {
    return `${value}['${configStore?.resourcePick}']`;
  } else {
    return value;
  }
};
export function NGTemplate({
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
	  options?: Omit<MutationObserverOptions<${responseType}${name}, HttpErrorResponse<${responseType}${name}>, ${requestType}${name}| undefined, unknown>, "mutationFn"> | undefined,
  httpOptions?:HttpRequest<${responseType}${name}>,
) => {
	return this.useMutation((args:${requestType}${name})=>{
         return this.Api._${
           tagName ? tagName + '.' : ''
         }${entityName}(args,httpOptions)
    }, options);
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
   * options?:
		| Omit<
				UseInfiniteQueryOptions<${getResourcePicked(
          `${responseType}${name}`
        )}, HttpErrorResponse<${responseType}${name}>, T, ${getResourcePicked(
          `${responseType}${name}`
        )}, (string | ${requestType}${name})[]>,
				"queryFn" | "queryKey"
		  >
		| undefined,
   ${deprecated ? '' : '*/ '}
   use${entityName}Infinit:(
	args: BehaviorSubject<${requestType}${name}>,
   httpOptions?:HttpRequest<${responseType}${name}>,
) => {

   args.pipe(
        switchMap(arg => {
          return this.useInfiniteQuery(['${
            tagName ? tagName + '.' : ''
          }${entityName}', arg], ({ pageParam = 1 }) => {

                return this.Api._${
                  tagName ? tagName + '.' : ''
                }${entityName}({ ...arg, 
                  params:{
                              ...arg.params,
                              PageNumber: pageParam,
                              }
                  },  httpOptions)
            }, {
                  keepPreviousData: true,
                  refetchOnMount: false,
                  refetchOnWindowFocus: false,
                  getNextPageParam: lastPage => {
                    return lastPage.result.hasNextPage ? lastPage.result.pageNumber + 1 : false;
                  },
              }).result$;
        }))
        
	
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
  use${entityName} :(

	args:  BehaviorSubject<${requestType}${name}>,
    options?: (Omit<NgQueryObserverOptions<${getResourcePicked(
      `${responseType}${name}`
    )}, HttpErrorResponse<${responseType}${name}>, ${getResourcePicked(
      `${responseType}${name}`
    )}, ${getResourcePicked(
      `${responseType}${name}`
    )}, (string|undefined | ${requestType}${name})[]>, "queryFn" | "initialData">) | undefined,
  httpOptions?:HttpRequest<${responseType}${name}>,
    extraKey?:string,
) => {
	return args.pipe(
        switchMap(arg => {
          return this.useQuery(['${
            tagName ? tagName + '.' : ''
          }${entityName}', arg,extraKey], () => {
                  return  this.Api._${
                    tagName ? tagName + '.' : ''
                  }${entityName}(arg,httpOptions)
            }, options).result$;

        }))
},
  ${deprecated ? '*/' : ' '}`;
}
