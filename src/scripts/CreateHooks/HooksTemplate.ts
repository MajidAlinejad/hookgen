import {OpenAPIV3} from 'openapi-types';
import {MethodIterator} from '../../func/MethodIterator/index.ts';
import {pathSplit} from '../../helper/index.ts';
import {configStore} from '../../config/index.ts';
import {SwrTemplate} from './swrTemplate.ts';
import {ReactQueryTemplate} from './ReactQueryTemplate.ts';
let openedScope: string | undefined = undefined;

export interface IHooksTemplate {
  path: string;
  method: string;
  media: OpenAPIV3.OperationObject;
}
type PathItemObject = OpenAPIV3.PathItemObject;
export function hookTemplate({
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
  let apis = '';
  if (configStore?.hook === 'ReactQuery') {
    apis = iteratedMathods
      ?.map(method => {
        return ReactQueryTemplate({
          method: method.objectName,
          path: objectName,
          media: method.objectMethod,
        });
      })
      .join('') as string;
  } else {
    apis = iteratedMathods
      ?.map(method => {
        return SwrTemplate({
          method: method.objectName,
          path: objectName,
          media: method.objectMethod,
        });
      })
      .join('') as string;
  }

  if (openedScope !== tagName) {
    const result =
      index === 0
        ? 'public ' + tagName + '={' + apis
        : ' \n}; \n public ' + tagName + '={' + apis;
    openedScope = tagName;

    return index + 1 === len ? result + '}; ' : result;
  } else {
    return index + 1 === len ? apis + '}; ' : apis;
  }
}
