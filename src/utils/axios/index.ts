import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import ora from 'ora';
import chalk from 'chalk';
import {Spec, Spins} from '../../types.ts';

axios.defaults.paramsSerializer = {
  indexes: null,
};

const spins: Spins[] = [];

/** configration for api request like header authorization  */
const configAxiosRequest = (
  config: InternalAxiosRequestConfig<unknown>
): InternalAxiosRequestConfig<unknown> => {
  const spinner = ora('axios get');
  spinner.text = '├ axios get :' + config.url;
  spinner.start();
  spins.push({id: config.url, spinner: spinner});
  return config;
};

/** this situation happen when request does not even send to network or internet */
const onAxiosRequestError = (error: AxiosError): Promise<AxiosError> => {
  const spinner = spins.find(
    spinObj => spinObj.id === error?.config?.url
  )?.spinner;
  spinner?.fail();
  return Promise.reject(error);
};

/** handle Response of api response  */
const onAxiosResponse = (response: AxiosResponse<Spec>): AxiosResponse => {
  const spinner = spins.find(
    spinObj => spinObj.id === response.config.url
  )?.spinner;
  spinner?.succeed();
  return response;
};

/** handle api response errors */
const onAxiosResponseError = (error: AxiosError): Promise<AxiosError> => {
  try {
    const spinner = spins.find(
      spinObj => spinObj.id === error?.config?.url
    )?.spinner;
    spinner?.fail();
    if (error.response) {
      console.warn(
        chalk.redBright(
          ' └ Error axios get with code :' + error.response.status
        )
      );
      /** this situation happen when request return a response with error object that contain a status code */
      // responseHandler(error.response.status)(error);
    } else if (error.request) {
      /** this situation happen when request does not return means that request fail duo to network error or sth like that */
      console.warn(chalk.redBright(' └ check your network Connection'));
    } else {
      console.error(chalk.redBright(' └ Error axios get ', error.message));
    }
    throw new Error(error.message);
  } catch (error) {
    console.error(chalk.redBright(' └ Error axios get:', error));
    return Promise.reject(error);
  }
};

/** handle axios response for errors and etc.. */
axios.interceptors.response.use(onAxiosResponse, onAxiosResponseError);
/** set axios request's header configration like autorization */
axios.interceptors.request.use(configAxiosRequest, onAxiosRequestError);

export default axios;
