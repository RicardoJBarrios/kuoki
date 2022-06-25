export const isNumber = (value: any) => typeof value === 'number';
export const isPrimitive = (value: any) => typeof value !== 'object' || value === null;
export const isObject = (value: any) => typeof value === 'object';
export const isFalsy = (value: any) => Boolean(value) === false;
export const isTruthy = (value: any) => Boolean(value) === true;
export const nullish = (value: any) => value == null;
export const isIterable = (value: any) =>
  typeof value === 'object' && value !== null && typeof value[Symbol.iterator] === 'function';
