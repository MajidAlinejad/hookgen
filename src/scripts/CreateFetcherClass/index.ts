/* eslint-disable no-async-promise-executor */
import {Spec} from '../../types.ts';
import chalk from 'chalk';
import ora from 'ora';
import {save} from '../../func/Save/save.ts';
import {definitionFullName, pathSplit} from '../../helper/index.ts';
import {PathIterator} from '../../func/PathMapper/index.ts';
import {camelCase} from '../../func/Typescript/TypeNameMaker/index.ts';
import {fetcherTemplate} from './fetcherTemplate.ts';
import {configStore} from '../../config/index.ts';

/** */
export async function createFetcherClass(definations: Spec[]) {
  const header =
    "/* eslint-disable @typescript-eslint/no-unused-vars */\nimport { ContentType, HttpClient, getData,AxiosOpt } from '../client'";
  const ngheader = `/* eslint-disable @typescript-eslint/no-unused-vars */\n
    import { HttpHeaders, HttpParams, HttpRequest } from "@angular/common/http";
    import {  HttpClient } from "../client";`;
  return new Promise<'done' | 'error'>(async resolve => {
    let hasError: 'done' | 'error' = 'done';
    const spinner = ora('Create definitions Fetcher').info();
    try {
      const fetcher = definations.map(
        async defination =>
          new Promise(async resolve => {
            spinner.text =
              'Create definitions Fetcher:' + defination.info.title;
            //

            const iteratedPaths = PathIterator(defination.paths);

            const apis = iteratedPaths?.map((path, index) => {
              return fetcherTemplate({
                ...path,
                index,
                len: iteratedPaths.length,
              });
            });
            const {definationName} = pathSplit(
              iteratedPaths?.[0].objectName as string
            );
            const data =
              ` ${configStore?.hook === 'NG' ? ngheader : header}
              import { ${camelCase(definationName)} } from "../types";
          export class ${camelCase(
            defination.info.title.replace('.', '')
          )}Apis${
            configStore?.hook === 'NG'
              ? ' extends HttpClient'
              : '<SecurityDataType = unknown> extends HttpClient<SecurityDataType>'
          } {

            public Api = {
             ` +
              apis?.join('') +
              `
            };\n}`;

            await save({
              data,
              fileName: 'index',
              location: definitionFullName(defination) + '/api',
              extention: '.' + configStore?.fileTypes.api,
            });
            //
            spinner.clear();
            resolve(data);
          })
      );

      await Promise.all(fetcher);
    } catch (error) {
      spinner.fail();
      hasError = 'error';
      console.error(chalk.redBright(' └ ' + error));
    }
    spinner.text = 'Create definitions Fetcher';
    hasError === 'done' && spinner.succeed();
    resolve(hasError);
  });
}
