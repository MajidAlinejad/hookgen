import {camelize, capitalize} from '../../../helper/index.ts';

export function typeNameMaker(name: string, extra = 'Set') {
  return 'I' + camelCase(name) + extra;
}
export function typeNameSpaceMaker(
  name: string,
  namespace: string,
  extra = 'Set'
) {
  return (
    namespace + '.I' + capitalize(camelize(nameRefineWithDot(name))) + extra
  );
}

export function nameRefine(name: string) {
  const reg = /[^a-zA-Z0-9]/g;

  return name.toString().replace(reg, '');
}
export function nameRefineWithDot(name: string) {
  const reg = /[^a-zA-Z0-9.]/g;

  return name.toString().replace(reg, '');
}

export function nameStringify(name: string) {
  return "'" + name + "'";
}

export function camelCase(name: string) {
  return capitalize(camelize(nameRefine(name)));
}
