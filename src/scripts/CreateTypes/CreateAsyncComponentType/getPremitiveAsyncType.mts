import {primitiveJs} from '../../../helper/index.ts';

export async function getPremitiveAsyncType(
  type: 'string' | 'number' | 'boolean' | 'integer' | undefined
) {
  return new Promise<string>(resolve => {
    const primitiveValue = primitiveJs(type);
    resolve(primitiveValue);
  });
}
