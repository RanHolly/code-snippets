/**
 * Small time function
 * @returns {string}
 */
const time = () => {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, `0`);
  const minute = date.getMinutes().toString().padStart(2, `0`);
  const second = date.getSeconds().toString().padStart(2, `0`);
  return `${hour}:${minute}:${second}`;
};

/**
 * Checking whether a given argument is a class. 
 * 
 * The “any” type is used in the arguments intentionally.
 * @param {any} obj 
 * @returns {boolean} true - class, false - other.
 */
const isClass = (obj) => typeof obj === `function` && /^\s*class\s+/.test(obj?.toString());

module.exports = { time, isClass };


//Territory of types. Implementation of .d.ts file in .js file

/**
 * @template {string |number|symbol} T
 * @typedef {T[] | []} ArrayMaybeEmpty
 */

/**
 * @template {string |number|symbol} T
 * @typedef {[T, ...T[]] | [T]} ArrayNotEmpty These arrays must have at least 1 element
 */

/**
 * @template {string |number|symbol} T
 * @template {number} N
 * @typedef {ArrayNotEmpty<T> & { length: N}} ArrayPathLimit Type for setting array size limit
 */

/** 
 * Imports
 * @typedef {import("./base/command").BaseCommand} BaseCommand 
 * @typedef {import("./base/events").BaseEvent} BaseEvent
 * @typedef {import("./base/handler").BaseHandler} BaseHandler
 */

/** @typedef {BaseCommand | BaseEvent} ModuleType */