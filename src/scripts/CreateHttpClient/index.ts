/* eslint-disable no-async-promise-executor */
import {Spec} from '../../types.ts';
import chalk from 'chalk';
import ora from 'ora';
import {httpClientTemplate} from './httpClientTemplate.ts';
import {save} from '../../func/Save/save.ts';
import {definitionFullName} from '../../helper/index.ts';
import {configStore} from '../../config/index.ts';

/** */
export async function createHttpClient(definations: Spec[]) {
  return new Promise<'done' | 'error'>(async resolve => {
    let hasError: 'done' | 'error' = 'done';
    const spinner = ora('Create definitions Client').info();
    try {
      const clients = definations.map(
        defination =>
          new Promise(async resolve => {
            spinner.text = 'Create definitions Client:' + defination.info.title;
            const data = httpClientTemplate();
            await save({
              data,
              fileName: 'index',
              location: definitionFullName(defination) + '/client',
              extention: '.' + configStore?.fileTypes.client,
            });
            spinner.clear();
            resolve(data);
          })
      );
      await Promise.all(clients);
    } catch (error) {
      spinner.fail();
      hasError = 'error';
      console.error(chalk.redBright(' └ ' + error));
    }
    spinner.text = 'Create definitions Client';
    hasError === 'done' && spinner.succeed();
    resolve(hasError);
  });
}
