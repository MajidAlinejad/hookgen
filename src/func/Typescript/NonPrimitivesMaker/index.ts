import {isNullable} from '../../../helper/index.ts';
// import {createComponentPrimitives} from '../../../scripts/CreateComponentSchemas/index.mts';
import {
  ComponentSchema,
  IOpenApiComponent,
  isArraySchemaObject,
  isReference,
} from '../../../types.ts';
import {interfaceMaker} from '../InterfaceMaker/index.ts';
import {typeNameMaker} from '../TypeNameMaker/index.ts';
import {peer} from '../peer/index.ts';

export const nonPrimitivesMaker = (
  properties: ComponentSchema,
  name: string
) => {
  if (!properties) {
    return;
  }
  const nonPrimitiveName = typeNameMaker(name);
  const nonPrimitiveValue = properties
    .map(item =>
      peer(
        item.objectName,
        typeNameMaker(name + item.objectName + typePostFix(item.objectSchema)),
        isNullable(item.objectSchema),
        !isReference(item.objectSchema) &&
          isArraySchemaObject(item.objectSchema)
      )
    )
    .join('');

  const nonPremitiveTypes = interfaceMaker(nonPrimitiveName, nonPrimitiveValue);
  return nonPremitiveTypes;
};

export const typePostFix = (schema: IOpenApiComponent) => {
  if (isReference(schema)) {
    return 'Ref';
  }

  if (schema.enum?.length) {
    return 'Enum';
  }

  if (schema.type === 'array') {
    const arrayType = typePostFix(schema.items) as string;
    return arrayType;
  }

  return '';
};
