/* eslint-disable @typescript-eslint/no-explicit-any */
import { assoc, clone, prop } from 'ramda';

import { fileToBase64 } from './fileToBase64';

export async function convertEntityFiles<T>(
  entity: T,
  params: (keyof T)[],
): Promise<T> {
  let newEntity: any = clone(entity);

  for (const param of params) {
    const oldValue = prop(param, entity);

    const value = oldValue instanceof File
      ? await fileToBase64(oldValue)
      : oldValue;

    newEntity = assoc(param as string, value, newEntity);
  }

  return newEntity as unknown as T;
}
