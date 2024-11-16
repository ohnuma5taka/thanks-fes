import _ from 'lodash';

type JsonObject = {
  [param: string]:
    | string
    | number
    | boolean
    | readonly (string | number | boolean)[];
};

const stringify = <T>(obj: T) => JSON.stringify(obj);
const parse = <T>(objString: string): T => JSON.parse(objString);
const deepCopy = <T>(obj: T): T => _.cloneDeep(obj);
const equals = <T>(obj1: T, obj2: T): boolean =>
  stringify(obj1) === stringify(obj2);
const isEmpty = <T>(obj: T) => equals(obj, {});
const snakeToCamel = (str: string) =>
  str.split('_').reduce((acc, curr, i) => {
    curr = i !== 0 ? curr[0].toUpperCase() + curr.slice(1) : curr;
    return acc + curr;
  }, '');
const toCamelCase = (object: unknown) => {
  if (object === null || typeof object !== 'object') return object;
  if (Array.isArray(object)) {
    object.forEach((x) => toCamelCase(x));
    return object;
  }
  Object.keys(object).forEach((key) => {
    const camelKey = snakeToCamel(key);
    if (camelKey !== key) {
      object[camelKey] = object[key];
      delete object[key];
    }
    toCamelCase(object[camelKey]);
  });
  return object;
};
const camelToSnake = (str: string) =>
  str
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();
const toSnakeCase = (object: unknown) => {
  if (object === null || typeof object !== 'object') return object;
  if (Array.isArray(object)) {
    object.forEach((x) => toSnakeCase(x));
    return object;
  }
  Object.keys(object).forEach((key) => {
    const camelKey = camelToSnake(key);
    if (camelKey !== key) {
      object[camelKey] = object[key];
      delete object[key];
    }
    toSnakeCase(object[camelKey]);
  });
  return object;
};

export const jsonUtil = {
  stringify,
  parse,
  deepCopy,
  equals,
  isEmpty,
  toSnakeCase,
  toCamelCase,
};
