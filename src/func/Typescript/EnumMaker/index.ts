import {enumMapper, enumPeer} from '../../EnumMapper/index.ts';
import {enumarateMaker, typeMaker} from '../TypeMaker/index.ts';
import {typeNameMaker} from '../TypeNameMaker/index.ts';

export const enumMaker = (enums: string[] | undefined, name: string) => {
  if (!enums) {
    return;
  }
  const discriminatedValue = enumMapper(enums);
  const discriminatedName = typeNameMaker(name);

  return typeMaker(discriminatedName, discriminatedValue);
};

export const enumerates = (enums: string[] | undefined, name: string) => {
  if (!enums) {
    return;
  }
  const enumName = typeNameMaker(name, 'Enum');
  const enumValue = enumPeer(enums);

  return enumarateMaker(enumName, enumValue);
};
