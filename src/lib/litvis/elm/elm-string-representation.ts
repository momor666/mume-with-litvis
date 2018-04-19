import * as LRU from "lru-cache";

const cache = LRU(100);

/**
 * Returns Elm's string representation as a JS value.
 *
 * Unlike parseElmStringRepresentation(), the function uses LRU cache
 * before attempting to parse value.
 *
 * Examples:
 * * '' -> null
 * * '42' -> 42
 * * '"42"' -> "42" (string)
 * * '{a = 1, b = 2}' -> {a: 1, b: 2} (json)
 * * '{0 = "a", 1 = 42}' -> ["a", 42] (array)
 */
export const getElmValue = (stringRepresentation: string) => {
  let valueInCache = cache.get(stringRepresentation);
  if (typeof valueInCache === "undefined") {
    try {
      valueInCache = parseStringRepresentation(stringRepresentation);
    } catch (e) {
      valueInCache = e;
    }
    cache.set(stringRepresentation, valueInCache);
  }
  if (valueInCache instanceof Error) {
    throw valueInCache;
  }
  return valueInCache;
};

/**
 * Parses Elm's string representation into a corresponding JS value.
 *
 * It is recommended to use getElmValue() instead as it is using cache.
 *
 * Examples:
 * * '' -> null
 * * '42' -> 42
 * * '"42"' -> "42" (string)
 * * '{a = 1, b = 2}' -> {a: 1, b: 2} (json)
 * * '{0 = "a", 1 = 42}' -> ["a", 42] (array)
 *
 * Array detection and conversion works recursively.
 */
export const parseStringRepresentation = (input: string): any => {
  if (typeof input !== 'string') {
    return undefined;
  }
  if (!input.length) {
    return null;
  }
  let patchedInput = input;
  if (input.charAt(0) === "{") {
    patchedInput = patchedInput
      .replace(/ = True/g, " = true")
      .replace(/ = False/g, " = false")
      .replace(/([$a-zA-Z_0-9]+)\s=\s/g, '"$1": ');
  }
  try {
    return recursivelyConvertApplicableObjectsToArrays(
      JSON.parse(patchedInput),
    );
  } catch (e) {
    throw new Error(
      `Could not parse "${
        input.length <= 20 ? input : `${input.substring(0, 15)}...`
      }" as JSON`,
    );
  }
};

/**
 * Scans through the object and replaces children like {"0": ..., "1": ..., "2": ...} into arrays.
 * Does not mutate the original object.
 * @param obj
 */
function recursivelyConvertApplicableObjectsToArrays(obj: object) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // apply the same function recursively for each key
  let childrenHaveChanged = false;
  const changedChildren = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newChild = recursivelyConvertApplicableObjectsToArrays(obj[key]);
      if (newChild !== obj[key]) {
        childrenHaveChanged = true;
        changedChildren[key] = newChild;
      }
    }
  }

  const resultingObject = childrenHaveChanged
    ? { ...obj, ...changedChildren }
    : obj;

  // convert any object that has only sequential numeric keys into an array
  const arrayValues = [];
  let nextExpectedKey = 0;
  for (const key in resultingObject) {
    if (resultingObject.hasOwnProperty(key)) {
      // stop object scanning if the given key does not belong to a numeric sequence
      if (parseInt(key, 10) !== nextExpectedKey) {
        return resultingObject;
      }
      nextExpectedKey += 1;
      arrayValues.push(resultingObject[key]);
    }
  }

  // reaching the end of loop means that the object needs to be converted
  return arrayValues;
}
