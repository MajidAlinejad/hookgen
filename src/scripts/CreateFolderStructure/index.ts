import makeDir from 'make-dir';
import {configStore} from '../../config/index.ts';
import chalk from 'chalk';
import ora from 'ora';
import {Spec} from '../../types.ts';

export async function createFolderStructure(schema: Spec[]) {
  return new Promise<'done' | 'error'>(resolve => {
    let hasError: 'done' | 'error' = 'done';

    schema.forEach(defination => {
      const spinner = ora(
        chalk.gray(
          ' ├ Create folder: "' +
            defination.info.title +
            '_' +
            defination.info.version +
            '"'
        )
      );
      makeDir(
        configStore?.outDir +
          '/' +
          defination.info.title +
          '_' +
          defination.info.version
      )
        .catch(error => {
          spinner.fail();
          console.error(chalk.redBright(' └ ' + error));
          hasError = 'error';
        })
        .then(() => {
          spinner.succeed();
        });
    });
    resolve(hasError);
  });
}
