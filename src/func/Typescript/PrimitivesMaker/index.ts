import {primitiveJs} from '../../../helper/index.ts';
import {typeMaker} from '../TypeMaker/index.ts';
// import {typeNameMaker} from '../TypeNameMaker/index.mts';

export const primitivesMaker = (
  types: 'string' | 'number' | 'boolean' | 'integer' | undefined,
  name: string
) => {
  if (!types) {
    return;
  }
  const primitiveName = name;
  const primitiveValue = primitiveJs(types);

  return typeMaker(primitiveName, primitiveValue);
};
