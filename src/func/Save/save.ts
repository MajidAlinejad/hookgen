import {format} from 'prettier';
import fs from 'fs';
import {configStore} from '../../config/index.ts';
import {ISaveBatch, ISaveFile} from '../../types.ts';
import ora from 'ora';
import chalk from 'chalk';
import makeDir from 'make-dir';

const writeFs = async ({
  data,
  fileName,
  location,
}: ISaveFile): Promise<fs.WriteStream> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const dir = await makeDir(location);
    if (dir) {
      const file = fs
        .createWriteStream(location + '/' + fileName)
        .once('open', () => {
          file.write(data);
          file.end();
        })
        .once('error', error => {
          reject(error);
        })
        .once('finish', () => {
          resolve(file);
        });
    }
  });
};

const getPrettierFileData = async (
  data: unknown,
  beautify = true
): Promise<string> => {
  if (beautify) {
    const beauty = await format(`${data}`, configStore?.prettier);
    return `${beauty}`;
  }
  return `${data}`;
};

export async function save({
  fileName,
  data,
  location,
  beautify,
  extention,
  comment,
}: ISaveFile) {
  if (data) {
    const spinner = ora(
      chalk.gray(' ├ Saving :"' + fileName + '" in :"' + location + '"')
    );
    try {
      const fileData = await getPrettierFileData(data, beautify);
      const dataStr = comment ? `\n /* ${comment} */\n` + fileData : fileData;
      await writeFs({
        data: dataStr,
        fileName: fileName + extention,
        location: configStore?.outDir + '/' + location,
      });
      spinner.succeed();
    } catch (error) {
      spinner.fail();
      console.error(chalk.redBright(' └ ' + error));
    }
  }
}

export function saveBatch({files, location, beautify, extention}: ISaveBatch) {
  const promisses = files.map(file => {
    if (file.data.length) {
      return save({
        data: file.data,
        fileName: file.name,
        beautify,
        location,
        extention,
        comment: file.comment,
      });
    } else {
      return null;
      // console.warn(
      //   chalk.green(
      //     ` └ ${file.name} in ${location} not saved duo to empty string! `
      //   )
      // );
    }
  });
  return Promise.all(promisses);
}
