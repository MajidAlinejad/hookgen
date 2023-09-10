import {camelCase} from '../Typescript/TypeNameMaker/index.ts';
import {equal} from '../Typescript/peer/index.ts';

export function enumMapper(enums: string[]) {
  const enumsType = '"' + enums.join('"|"') + '"';
  return enumsType;
}
export function enumPeer(enums: string[]) {
  const value = enums.map(e => equal(camelCase(e), e));
  const enumsType = value.join('');
  return enumsType;
}
