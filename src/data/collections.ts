const duplications: string[] = [];
export {duplications};

export function isDuplicate(key: string) {
  const isDuplicate = duplications.includes(key);
  if (!isDuplicate) {
    duplications.push(key);
  }
  // return isDuplicate;
  return false;
}
