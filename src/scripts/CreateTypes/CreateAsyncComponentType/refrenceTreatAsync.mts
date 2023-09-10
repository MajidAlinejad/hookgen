export function refrenceTreatAsync(rawRef: string) {
  const refPath = rawRef.split('/');
  const ref = refPath[refPath.length - 1];
  return ref;
}
