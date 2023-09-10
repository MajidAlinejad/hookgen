/* eslint-disable no-async-promise-executor */
import {Spec} from '../../types.ts';
import chalk from 'chalk';
import ora from 'ora';
import {save} from '../../func/Save/save.ts';
import {definitionFullName} from '../../helper/index.ts';
import {PathIterator} from '../../func/PathMapper/index.ts';
import {camelCase} from '../../func/Typescript/TypeNameMaker/index.ts';
import {hookTemplate} from './HooksTemplate.ts';
import {configStore} from '../../config/index.ts';
const importReactQuery =
  'import { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";';
const importSwr =
  "import useSWR from 'swr';import useSWRMutation, {SWRMutationConfiguration} from 'swr/mutation';import {PublicConfiguration} from 'swr/_internal';";

/** */
export async function createHooks(definations: Spec[]) {
  return new Promise<'done' | 'error'>(async resolve => {
    let hasError: 'done' | 'error' = 'done';
    const spinner = ora('Create definitions Hooks').info();
    try {
      const hooks = definations.map(
        async defination =>
          new Promise(async resolve => {
            spinner.text = 'Create definitions Hooks:' + defination.info.title;
            const iteratedPaths = PathIterator(defination.paths);
            const definationName = camelCase(
              defination.info.title.replace('.', '')
            );
            const hooks = iteratedPaths?.map((path, index) => {
              return hookTemplate({...path, index, len: iteratedPaths.length});
            });
            const data =
              `/* eslint-disable @typescript-eslint/no-explicit-any */\n/* eslint-disable @typescript-eslint/no-unused-vars */\nimport { ${definationName}Apis } from '../api'
          ${configStore?.hook === 'ReactQuery' ? importReactQuery : importSwr}
          export class ${definationName} extends ${definationName}Apis {
             ` +
              hooks?.join('') +
              '\n}';

            await save({
              data,
              fileName: 'index',
              location: definitionFullName(defination) + '/hooks',
              extention: '.' + configStore?.fileTypes.hook,
            });
            resolve(data);
            //
            spinner.clear();
          })
      );
      await Promise.all(hooks);
    } catch (error) {
      spinner.fail();
      hasError = 'error';
      console.error(chalk.redBright(' └ ' + error));
    }
    spinner.text = 'Create definitions Hooks';
    hasError === 'done' && spinner.succeed();
    resolve(hasError);
  });
}
