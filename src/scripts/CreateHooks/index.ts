/* eslint-disable no-async-promise-executor */
import {Spec} from '../../types.ts';
import chalk from 'chalk';
import ora from 'ora';
import {save} from '../../func/Save/save.ts';
import {definitionFullName, pathSplit} from '../../helper/index.ts';
import {PathIterator} from '../../func/PathMapper/index.ts';
import {camelCase} from '../../func/Typescript/TypeNameMaker/index.ts';
import {hookTemplate} from './HooksTemplate.ts';
import {configStore} from '../../config/index.ts';
const importReactQuery =
  'import { AxiosOpt } from "../client";import { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";';
const importSwr =
  "import { AxiosOpt } from '../client';import useSWR from 'swr';import useSWRMutation, {SWRMutationConfiguration} from 'swr/mutation';import {PublicConfiguration} from 'swr/_internal';";
const importNg = `
 import { UseInfiniteQuery,UseQuery,UseMutation } from '@ngneat/query';
 import { inject } from '@angular/core';
 import { NgQueryObserverOptions } from '@ngneat/query/lib/query';
 import {  MutationObserverOptions} from '@tanstack/query-core'
 import { HttpRequest,HttpHeaders } from "@angular/common/http";
 import { BehaviorSubject, switchMap } from 'rxjs';
  // 
 export interface HttpErrorResponse<T>{
    error?: T;
    headers?: HttpHeaders;
    status?: number;
    statusText?: string;
    url?: string;
 }

 `;
const injectsNg = `  
  private useInfiniteQuery = inject(UseInfiniteQuery);
  private useQuery = inject(UseQuery);
  private useMutation = inject(UseMutation);
  `;
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
            const {definationName: declarationName} = pathSplit(
              iteratedPaths?.[0].objectName as string
            );

            const hooks = iteratedPaths?.map((path, index) => {
              return hookTemplate({...path, index, len: iteratedPaths.length});
            });
            const data =
              `/* eslint-disable @typescript-eslint/no-explicit-any */
              /* eslint-disable @typescript-eslint/no-unused-vars */
               import { ${definationName}Apis } from '../api';
               import { ${camelCase(declarationName)} } from "../types";
              
          ${
            configStore?.hook === 'ReactQuery'
              ? importReactQuery
              : configStore?.hook === 'NG'
                ? importNg
                : importSwr
          }
          export class ${definationName} extends ${definationName}Apis {
             ` +
              (configStore?.hook === 'NG' ? injectsNg : '') +
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
