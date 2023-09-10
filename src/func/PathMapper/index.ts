import {OpenAPIV3} from 'openapi-types';
import chalk from 'chalk';

type PathItemObject = OpenAPIV3.PathItemObject;
export interface IPathIterator {
  objectName: string;
  objectPath: PathItemObject;
}
export function PathIterator(Path: PathItemObject) {
  if (!Path) {
    console.warn(
      chalk.yellow(
        ' └ Defination Object must be include at least one Path but it is undefined!'
      )
    );
    return;
  }
  const entries = Object.entries(Path);
  const object = entries.map(cur => {
    return {
      objectName: cur[0],
      objectPath: cur[1] as PathItemObject,
    };
  });

  return object;
}
