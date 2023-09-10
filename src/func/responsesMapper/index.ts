import {OpenAPIV3} from 'openapi-types';
import chalk from 'chalk';

export function responsesMapper(Response: OpenAPIV3.ResponsesObject) {
  if (!Response) {
    console.warn(
      chalk.yellow(
        ' └ Responses Object must be include at least one Response but it is undefined!'
      )
    );
    return;
  }
  const entries = Object.entries(Response);
  const object = entries.map(cur => {
    return {
      objectName: cur[0],
      objectResponse: cur[1],
    };
  });

  return object;
}
