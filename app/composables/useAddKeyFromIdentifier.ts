import type { Keyified } from "~/types/utils";

export default function<T extends { identifier: string } | { id: string }>(object: T): Keyified<T> {
  if ("id" in object) {
    return { ...object, key: object.id };
  }

  return { ...object, key: object.identifier };
};
