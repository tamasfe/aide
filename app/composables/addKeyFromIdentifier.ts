import type { Keyified } from "~/types/utils";

export const useAddKeyFromIdentifier = <T extends { identifier: string }>(object: T): Keyified<T> => {
  return { ...object, key: object.identifier };
};
