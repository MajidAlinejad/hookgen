import {OpenAPIV3} from 'openapi-types';
import {typeNameMaker} from '../func/Typescript/TypeNameMaker/index.ts';
import {Spec, isReference} from '../types.ts';
const repoTypes: string[] = [''];
export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function camelize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

export const primitiveJs = (
  key: 'string' | 'number' | 'boolean' | 'integer' | undefined
) => {
  switch (key) {
    case 'integer':
      return 'number';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
      return 'string';

    default:
      return 'unknown';
  }
};

export const definitionFullName = (defination: Spec) => {
  return defination.info.title + '_' + defination.info.version;
};

export const isDuplication = (name: string, data: string[]): boolean => {
  const iName = typeNameMaker(name);
  const include = repoTypes.some(item => item.includes(iName));
  const dataInclude = data.some(item => item.includes(iName));
  if (include && dataInclude) {
    return true;
  }
  repoTypes.push(iName);
  return false;
};

export const isNullable = (
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
): boolean | undefined => {
  if (!isReference(schema)) {
    return schema.nullable;
  }
  return undefined;
};

export const definationComment = (defination: Spec, data: string[][]) => {
  data.forEach(fileData => {
    fileData.push(
      `\n/* ${defination.info.title} - ${defination.info.version} */\n`
    );
  });
};
export const getDefinationComment = (defination: Spec) => {
  return ` ${defination.info.title} - ${defination.info.version}`;
};

export function statusString(status: string) {
  const okReg = /2\d\d/g;
  const badReg = /400/g;
  if (okReg.test(status)) {
    return 'Ok';
  }

  if (badReg) {
    return 'Bad';
  }

  return;
}

export const pathSplit = (path: string) => {
  const reg = /\/{\w*}/g;
  const refinePath = path.replace(reg, '');
  const pathScope = refinePath.split('/') as string[];
  const definationName = pathScope[1] as string;
  const scopeName = pathScope[3] as string;
  const itemName = ((pathScope[pathScope.length - 1] as string) +
    camelize(pathScope[pathScope.length - 2])) as string;

  return {pathScope, definationName, scopeName, itemName};
};
