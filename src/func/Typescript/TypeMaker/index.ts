export function typeMaker(
  TypeName: string,
  core: string,
  object?: boolean,
  hasExport?: boolean
) {
  if (object)
    return (
      `${hasExport ? 'export' : ''} type ` + TypeName + '= {' + core + '};'
    );
  return `${hasExport ? 'export' : ''} type ` + TypeName + '= ' + core + ';';
}

export function enumarateMaker(enumName: string, core: string) {
  return 'export enum ' + enumName + ' {' + core + '};';
}
