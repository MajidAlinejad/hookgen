import {camelize, capitalize} from '../../../helper/index.ts';

export function typeNameMaker(name: string, extra: string = 'Set') {
  return 'I' + camelCase(name) + extra;
}

export function nameRefine(name: string) {
  const reg = /[^a-zA-Z0-9]/g;

  return name.replace(reg, '');
}

export function nameStringify(name: string) {
  return "'" + name + "'";
}

export function camelCase(name: string) {
  return capitalize(camelize(nameRefine(name)));
}
