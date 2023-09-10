import {OpenAPIV3} from 'openapi-types';
import chalk from 'chalk';

type PathItemObject = OpenAPIV3.PathItemObject;
type IMethod = Omit<
  PathItemObject,
  '$ref' | 'description' | 'parameters' | 'servers' | 'summary'
>;

export interface MethodIterator {
  objectName: string;
  objectMethod: OpenAPIV3.OperationObject;
}
export function MethodIterator(Method: IMethod | undefined) {
  if (!Method) {
    console.warn(
      chalk.yellow(
        ' └ Path Object must be include at least one method but it is undefined!'
      )
    );
    return;
  }
  const entries = Object.entries(Method);
  const object = entries.map(cur => {
    return {
      objectName: cur[0],
      objectMethod: cur[1] as OpenAPIV3.OperationObject,
    };
  });

  return object;
}
