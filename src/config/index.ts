import chalk from 'chalk';
import ora from 'ora';
import {cosmiconfig} from 'cosmiconfig';
import {IConfig} from '../types.ts';
import {ConfigStore} from './store/store.ts';
const spinner = ora('get hookgenrc config file');
const explorer = () => cosmiconfig('hookgenrc');
// eslint-disable-next-line prefer-const
export let configStore: ConfigStore | undefined = undefined;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export async function getConfig(): Promise<IConfig | undefined> {
  spinner.start();
  try {
    const configFile = await explorer().load('./hookgenrc.json');
    if (configFile?.isEmpty) {
      spinner.warn();
      console.warn(chalk.yellow(' └ codegen file is empty!'));
      return Promise.resolve(undefined);
    } else {
      spinner.succeed();
      configStore = new ConfigStore(configFile?.config as IConfig);
      return configFile?.config as IConfig;
    }
  } catch (error) {
    spinner.fail();
    console.error(
      chalk.bgRedBright(error ? error : ' └ Error get config file')
    );
    throw new Error(
      chalk.bgRedBright(error ? error : ' └ Error get config file')
    );
  }
}
