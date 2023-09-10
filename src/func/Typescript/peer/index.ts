import {nameStringify} from '../TypeNameMaker/index.ts';

export function peer(
  name: string,
  type: string,
  nullable?: boolean,
  isArray?: boolean
) {
  return (
    nameStringify(name) +
    (nullable ? '?:' : ':') +
    type +
    (isArray ? '[];' : ';')
  );
}
export function equal(name: string, type: string) {
  return name + '=' + nameStringify(type) + ',';
}
