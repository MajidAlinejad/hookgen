/* eslint-disable no-async-promise-executor */
import ora from 'ora';
import {Spec} from '../../types.ts';
import chalk from 'chalk';
// import {CreateAsyncPathes} from './createPathAsync/index.mts';
import {CreateAsyncGlobalType} from './CreateAsyncGlobalType/index.ts';
import {save} from '../../func/Save/save.ts';
import {definitionFullName, getDefinationComment} from '../../helper/index.ts';
// import {CreateAsyncComponentType} from './CreateAsyncComponentType/index.mts';
import {CreateAsyncComponentType} from './CreateAsyncComponentType/index.mts';
import {configStore} from '../../config/index.ts';
const common = `interface ICOMMNON {
  data?: never;
  params?: never;
  header?: never;
}`;
export async function createTypes(definations: Spec[]) {
  return new Promise<'done' | 'error'>(async resolve => {
    let hasError: 'done' | 'error' = 'done';
    const spinner = ora('Create Types').info();
    try {
      const definationPromisses = definations.map(defination => {
        return new Promise<string>(async resolve => {
          spinner.text = 'Create Types:' + defination.info.title;
          //
          const [component, enums] = await CreateAsyncComponentType(defination);
          const types = await CreateAsyncGlobalType(defination);
          await save({
            data: common + types,
            fileName: 'index',
            location: definitionFullName(defination) + '/types',
            extention: '.' + configStore?.fileTypes.types,
            comment: getDefinationComment(defination),
          });
          await save({
            data: component,
            fileName: 'type',
            location: definitionFullName(defination) + '/types',
            extention: '.' + configStore?.fileTypes.types,
            comment: getDefinationComment(defination),
          });
          await save({
            data: enums,
            fileName: 'index',
            location: definitionFullName(defination) + '/enums',
            extention: '.' + configStore?.fileTypes.enums,
            comment: getDefinationComment(defination),
          });

          //
          spinner.clear();
          resolve(types);
        });
      });
      await Promise.all(definationPromisses);

      resolve(hasError);
    } catch (error) {
      spinner.fail();
      hasError = 'error';
      console.error(chalk.redBright(' └ ' + error));
    }
    spinner.text = 'Create Types';
    hasError === 'done' && spinner.succeed();
    resolve(hasError);
  });
}
