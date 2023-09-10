export function interfaceMaker(
  InterfaceName: string,
  core: string,
  extend?: string
) {
  if (extend)
    return (
      'interface ' +
      InterfaceName +
      (extend ? ' extends ' + extend : '') +
      ' {' +
      core +
      '}'
    );
  return 'interface ' + InterfaceName + '{' + core + '}';
}
