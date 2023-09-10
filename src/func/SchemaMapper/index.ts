import {OpenAPIV3} from 'openapi-types';
import chalk from 'chalk';
import {ISchema} from '../../types.ts';

export function schemaIterator(schema: ISchema | undefined) {
  if (!schema) {
    console.warn(
      chalk.yellow(
        ' └ Component must be include either OpenAPIV3.ReferenceObject or OpenAPIV3.SchemaObject but it is undefined!'
      )
    );
    return;
  }
  const entries = Object.entries(schema);
  const object = entries.map(cur => {
    return {
      objectName: cur[0],
      objectSchema: cur[1] as
        | OpenAPIV3.ReferenceObject
        | OpenAPIV3.SchemaObject,
    };
  });

  return object;
}
