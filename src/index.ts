/* eslint-disable node/no-unsupported-features/node-builtins */
import {getConfig} from './config/index.ts';
import ora from 'ora';
import {getDefinationsAndSave} from './scripts/GetDefinationsAndSave/index.ts';
import {createFolderStructure} from './scripts/CreateFolderStructure/index.ts';

import chalk from 'chalk';
import {createTypes} from './scripts/CreateTypes/index.ts';
import {createHttpClient} from './scripts/CreateHttpClient/index.ts';
import {createFetcherClass} from './scripts/CreateFetcherClass/index.ts';
import {createHooks} from './scripts/CreateHooks/index.ts';
const spinner = ora('Code Gen').info();

async function codeGen() {
  spinner.start();

  const configs = await getConfig();
  if (configs) {
    console.table(configs);
    const definations = await getDefinationsAndSave();
    await createFolderStructure(definations);
    await createTypes(definations);
    await createHttpClient(definations);
    await createFetcherClass(definations);
    await createHooks(definations);
    spinner.succeed();
  } else {
    spinner.fail();
    console.error(chalk.red(' └ No baseUrl detected!'));
  }
}

export default codeGen();
