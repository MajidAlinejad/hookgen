import {schemaIterator} from '../../../func/SchemaMapper/index.ts';
import {enumarateMaker} from '../../../func/Typescript/TypeMaker/index.ts';
import {Spec} from '../../../types.ts';
import {AsyncRecursiveComponent} from './AsyncRecursiveComponent.mts';
import {componentMediaOrRef} from './componentMediaOrRef.mts';

export async function CreateAsyncComponentType(defination: Spec) {
  return new Promise<[string, string]>(async resolve => {
    const iteratedSchema = schemaIterator(defination.components?.schemas);

    if (iteratedSchema?.length) {
      const componentPromisses = iteratedSchema?.map(schema => {
        return AsyncRecursiveComponent({
          component: schema.objectSchema,
          name: schema.objectName,
        });
      });

      if (componentPromisses?.length) {
        const result = await Promise.all(componentPromisses);
        const component = result
          .map(item => {
            const res = componentMediaOrRef(item);
            return res;
          })
          .join('');

        const enums = result
          .map(item => {
            const res =
              item?.type === 'ENUM'
                ? enumarateMaker(
                    item?.name || 'NoName',
                    item?.data[1] as string
                  )
                : '';
            return res;
          })
          .join('');
        resolve([component, enums]);
      }
    }
    resolve(['', '']);
  });
}
