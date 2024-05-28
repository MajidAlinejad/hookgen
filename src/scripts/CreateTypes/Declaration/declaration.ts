import {camelCase} from '../../../func/Typescript/TypeNameMaker/index.ts';

export function wrapDeclartionNameSpace(definationName: string, data: string) {
  return (
    `export declare namespace ${camelCase(definationName)} { ` + data + ' } '
  );
}
export function wrapNameSpace(scopeName: string, data: string) {
  return `namespace ${camelCase(scopeName)} { ` + data + ' } ';
}
