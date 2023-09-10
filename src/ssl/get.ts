import {
  IGetFromSwaggerRootHtml,
  IGetSwaggerDefenitions,
  ISwaggerRootHtml,
  Spec,
} from '../types.ts';
import ora from 'ora';
import chalk from 'chalk';
import Axios from '../utils/axios/index.ts';

export async function getFromSwaggerRootHtml({
  baseUrl,
  sslConfiguredAgent,
}: IGetFromSwaggerRootHtml): Promise<ISwaggerRootHtml> {
  const info = ora('get Swagger defination lists').info().start();

  const {data} = await Axios.request<string>({
    url: baseUrl,
    method: 'get',
    headers: {
      'content-type': 'application/json',
    },
    httpsAgent: sslConfiguredAgent,
  });

  try {
    const regex = /"urls":\[.*\]/g;
    const listRegExpMatchArray = data.match(regex);
    const result = '{' + listRegExpMatchArray + '}';
    info.text = '└ get Swagger defination lists';
    info.succeed();
    return JSON.parse(result);
  } catch (error) {
    info.fail();
    info.text = '└ get Swagger defination lists';
    throw new Error('can not done "get Swagger defination lists"! ');
  }
}

export async function getSwaggerSchemaJsons({
  requests,
  sslConfiguredAgent,
}: IGetSwaggerDefenitions) {
  const REQ_Header = {
    headers: {
      'content-type': 'application/json',
    },
    httpsAgent: sslConfiguredAgent,
  };

  const spinner = ora('get Swagger definations Schemas').info();
  spinner.start();
  try {
    const responses = await Axios.all<Spec>(
      requests.map(endpoint =>
        Axios.get(endpoint, REQ_Header)
          .then(res => {
            if (res.data.paths) {
              return res.data;
            } else {
              console.warn(
                chalk.yellow(
                  ' └ Warning: checking endpoint:' +
                    endpoint +
                    ' !! is it empty?'
                )
              );
              return res.data;
            }
          })
          .catch(() => {
            throw new Error('error geting json with address:' + endpoint);
          })
      )
    );
    if (responses) {
      spinner.text = '└ get Swagger definations Schemas';
      spinner.succeed();
      return responses;
    } else {
      throw new Error('no responses');
    }
  } catch (error) {
    spinner.text = '└ get Swagger definations Schemas';
    spinner.fail();
    throw new Error(
      chalk.bgRedBright(
        error ? error : 'can not done "get Swagger definations Schemas"! '
      )
    );
  }
}
