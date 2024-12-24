export const useAddKeyFromId = <T extends { id: number | string }>(object: T): T & { key: string } => {
  return { ...object, key: String(object.id) };
};
