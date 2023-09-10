const duplications: string[] = [];
export {duplications};

export function isDuplicate(key: string) {
  const isDuplicate = duplications.includes(key);
  if (!isDuplicate) {
    duplications.push(key);
  }
  return isDuplicate;
}

export async function resetDuplicationData() {
  return new Promise(resolve => {
    duplications.splice(0, duplications.length);
    if (duplications.length === 0) {
      resolve(duplications);
    }
  });
}
