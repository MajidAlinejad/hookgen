/* eslint-disable no-async-promise-executor */
import {MethodIterator} from '../../../func/MethodIterator/index.ts';
import {IPathIterator, PathIterator} from '../../../func/PathMapper/index.ts';
import {camelCase} from '../../../func/Typescript/TypeNameMaker/index.ts';
import {pathSplit} from '../../../helper/index.ts';
import {Spec} from '../../../types.ts';
import {
  wrapDeclartionNameSpace,
  wrapNameSpace,
} from '../Declaration/declaration.ts';
import {CreateAsyncTypeMethod} from './Method/CreateAsyncTypeMethod.ts';

export async function CreateAsyncGlobalType(defination: Spec) {
  return new Promise<string>(async resolve => {
    const iteratedPaths = PathIterator(defination.paths);
    const namespace = defination.info.title
      .replaceAll('.', '')
      .replaceAll(' ', '');
    if (iteratedPaths?.length) {
      const pathPromises = iteratedPaths?.map(path => {
        return CreateAsyncTypeScope(path, namespace);
      });

      if (pathPromises?.length) {
        const data = await Promise.all(pathPromises);
        const {definationName} = pathSplit(iteratedPaths[0].objectName);
        const file = wrapDeclartionNameSpace(
          camelCase(definationName),
          data.join('')
        );
        resolve(file);
      }
    }
    resolve('');
  });
}

export function CreateAsyncTypeScope(
  path: IPathIterator,
  namespace: string
): Promise<string> {
  return new Promise(async resolve => {
    const {scopeName, itemName} = pathSplit(path.objectName);
    const iteratedMathods = MethodIterator(path.objectPath);
    const tagName =
      scopeName || iteratedMathods?.[0].objectMethod.tags?.[0] || '__NO_TAG';
    const methodPromises = iteratedMathods?.map(async method => {
      return await CreateAsyncTypeMethod(
        method,
        camelCase(itemName),
        namespace
      );
    });

    if (methodPromises?.length) {
      const data = await Promise.all(methodPromises);
      const file = wrapNameSpace(camelCase(tagName), data.join(''));
      resolve(file);
    }
  });
}
