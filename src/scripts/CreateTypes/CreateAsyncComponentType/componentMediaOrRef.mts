import {isDuplicate} from '../../../data/collections.ts';
import {interfaceMaker} from '../../../func/Typescript/InterfaceMaker/index.ts';
import {peer} from '../../../func/Typescript/peer/index.ts';
import {typeMaker} from '../../../func/Typescript/TypeMaker/index.ts';
import {typeNameMaker} from '../../../func/Typescript/TypeNameMaker/index.ts';
import {IAsyncRecursiveComponentResult} from './AsyncRecursiveComponent.mts';

export function componentMediaOrRef(
  component: IAsyncRecursiveComponentResult | null
) {
  if (component) {
    if (component.type === 'REF') {
      return peer(
        component.name || '___NoNameREF?',
        typeNameMaker(component.data[0] || 'noNameREF_PARAM?'),
        component.nullable,
        component.isArray
      );
    }
    if (component.type === 'PREM') {
      return peer(
        component.name || '___NoNamePREM?',
        component.data[0],
        component.nullable,
        component.isArray
      );
    }
    if (component.type === 'ENUM') {
      const duplicate = isDuplicate(component.name as string);
      return !duplicate
        ? typeMaker(
            typeNameMaker(component.name || '___NoNameENUM'),
            component.data[0]
          )
        : '';
    }
    if (component.type === 'MEDIA') {
      const duplicate = isDuplicate(component.name as string);
      return !duplicate
        ? interfaceMaker(
            typeNameMaker(component.name || '___NoNameMEDIA'),
            component.data[0]
          )
        : '';
    }
    if (component.type === 'MEDIA_TYPE') {
      const duplicate = isDuplicate(component.name as string);
      return !duplicate
        ? typeMaker(
            typeNameMaker(component.name || '___NoNameMEDIA'),
            component.data[0]
          )
        : '';
    }
  }
  return '';
}
