import {enumMapper, enumPeer} from '../../../func/EnumMapper/index.ts';

export async function getEnumAsyncType(enums: any[]) {
  return new Promise<[string, string?]>(resolve => {
    const enumType = enumMapper(enums);
    const enumValue = enumPeer(enums);
    resolve([enumType, enumValue]);
  });
}
