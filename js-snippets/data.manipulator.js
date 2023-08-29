/**
 * The `DataManipulator` class provides convenient methods for interacting with data objects.
 *
 * The main functional class includes object comparison, array searching in objects, and element comparison on queries.
 *
 * Classification of working conditions with objects of various sizes and structures.
 *
 * If you need to perform a more precise comparison or adjustment, you can specify the path for the objects.
 *
 * If only one of the two paths in an object is specified, it will apply to both objects.
 *
 * Notes:
 * - The class does not support recursive objects.
 * - Pay attention to your data sizes to avoid memory limit.
 *
 * Examples of using:
 * @example
 * const dataManipulator = new DataManipulator(data1, data2, { end1: 'path.to.data' }); //only the first 2 fields are required.
 * const result = dataManipulator.build();
 */
export class DataManipulator {

  /**
   * An instance of the DataManipulator class has been created.
   * @param {any} repoData The first data object to compare.
   * @param {any} data The second data object to compare.
   * @param {{ end1: string; end2?: string }} ends Object, a single way to compare objects.
   */
  constructor(repoData, data, ends) {
    this.repoData = repoData;
    this.data = data;

    if (ends) {
      const endsKeys = Object.keys(ends);
      const endKey1 = endsKeys[0];
      const endKey2 = endsKeys[1];
      switch (endsKeys.length) {
        case 1: {
          const key = ends[endKey1];

          if (typeof key !== 'string') throw new Error('Wrong data type in "ends" object! Only a string is allowed.');
          if (key.length === 0) throw new Error(`You don't define the path to the object!`);

          this.ends = { end1: key, end2: key };
          break;
        }
        case 2: {
          const key1 = ends[endKey1];
          const key2 = ends[endKey2];

          if (typeof key1 !== 'string' || typeof key2 !== 'string') throw new Error(`Недопустимый тип данных в аргументах ends! В аргументах ends разрешена только строка.`);

          if (key1.length === 0) throw new Error('You didn\'t provide a path for the object in the first object "ends"!');
          if (key2.length === 0) throw new Error('You didn\'t provide a path for the object in the second "ends" object!');

          this.ends = { end1: key1, end2: key2 };
          break;
        }
        default:
          throw new Error(`Invalid number of arguments (${endsKeys.length}/2) for 'ends'! Allowed: 1-2 arguments.`);
      }
    }
  }

  /**
   * The `checkArrays` method is designed to check if one or both of the passed objects are arrays. This method takes two objects and returns an object containing flags for both objects. If the object is an array, the corresponding flag is set to `true`, otherwise `false`. If either or both objects are `null`, the method returns `null`.
   * 
   * @param {any} obj1 The first object to check.
   * @param {any} obj2 The second object to check.
   * @returns {{ obj1: boolean, obj2: boolean } | null} An object containing flags for both objects, or null if one or both of the objects are null.
   */
  #checkArrays(obj1, obj2) {
    if (Array.isArray(obj2) && !Array.isArray(obj1)) {
      return null;
    }

    return {
      obj1: Array.isArray(obj1),
      obj2: Array.isArray(obj2),
    };
  }

  /**
   * Checks objects against comparison criteria.
   * @param {any} obj1 The first object to check.
   * @param {any} obj2 The second object to check.
   * @returns {{ obj1: boolean, obj2: boolean } | null} An object with validation, or `null` if necessary.
   * @private
   */
  #checkObjects(obj1, obj2) {
    if ((typeof obj1 !== 'object' && !Array.isArray(obj1)) || (typeof obj2 !== 'object' && !Array.isArray(obj2))) {
      return null;
    }

    return {
      obj1: typeof obj1 === 'object',
      obj2: typeof obj2 === 'object',
    };
  }

  /**
   * Processes the path to the object, replacing empty elements with the number 0.
   * @param {string} path The path to the object.
   * @returns {string} processed path.
   * @private
   */
  #fixArrayPath(path) {
    if (!path.includes('..')) {
      return path; // If there are no empty fields (..), return the text unchanged
    }

    const split = path.split('.');
    let result = '';

    for (let i = 0; i < split.length; i++) {
      const data = split[i];
      if (data === '') {
        // If the element is empty, add 0
        result += '0';
      } else {
        result += data;
      }
      if (i !== split.length - 1) {
        result += '.';
      }
    }

    return result;
  }

  /**
   * Traverses the object along the specified path and returns the element pointed to by the path.
   * @param {any} obj The object to bypass.
   * @param {string} path The path to the element.
   * @returns {any | null} An element that specifies the path, or `null` if the path is invalid.
   * @private
   */
  traverseObjectByPath(obj, path) {
    const correctedPath = this.#fixArrayPath(path);
    const keys = correctedPath.split('.');
    let current = obj;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return null; // Object does not contain the specified path
      }
    }

    return current;
  }

  /**
  * The findFirstArray method is used to compare two objects and find the first array in their structures. It takes two objects and looks for the first array in the "depth" of the first object, or the last element of the first object if it contains no arrays. The return result can be an object containing the found arrays from each object, or a string describing the error, or `null` if the comparison is not possible.
   * @param {any} obj1 The first object to search for arrays or the last element.
   * @param {any} obj2 The second object used to "deepen" the structure of the first object.
   * @returns {{ obj1: {} | [], obj2: {} | [] } | string | null} An `object`, `array`, or other data type. In case of an `error`, it can be `null` or an `error object`.
   */
  findFirstArray(obj1, obj2) {
    const checkArray = this.#checkArrays(obj1, obj2);
    const checkObject = this.#checkObjects(obj1, obj2);

    if (!checkObject) {
      return null; // Both objects are not objects
    }

    if (!checkArray) {
      if (Array.isArray(obj2)) {
        throw new Error('obj1 is not an array, but obj2 is an array. This is not allowed.');
      }
      return obj1; // If obj1 is not an array, return it
    }

    const { obj1: isObj1Array, obj2: isObj2Array } = checkArray;

    if (!isObj1Array && isObj2Array) {
      throw new Error('obj1 is not an array, but obj2 is an array. This is not allowed.');
    }

    const obj2Keys = Object.keys(obj2);

    if (obj2Keys.length === 0) {
      return 'obj2 does not have any properties.';
    }

    const key = obj2Keys[0];

    if (obj1.hasOwnProperty(key)) {
      if (Array.isArray(obj1[key])) {
        return {
          obj1: obj1[key],
          obj2: obj2[key],
        };
      }

      if (Array.isArray(obj2[key]) && !Array.isArray(obj1[key])) {
        throw new Error('obj1 is not an array, but obj2 is an array. This is not allowed.');
      }

      const result = this.findFirstArray(obj1[key], obj2[key]);

      if (result !== null && typeof result !== 'string') {
        return result;
      }
    }

    // If the second object is deeper and not comparable to the first, return both objects
    return { obj1: obj1[key], obj2: obj2[key] };
  }

  /**
  * The compareObjectsByPath method is designed to compare two objects along the specified paths. It takes two objects and an `ends` parameter containing the paths to compare. If the specified paths match, the method compares the elements along the common path. If the comparison is successful, the method returns an object containing the compared elements from both objects. If an error occurs during the comparison or the specified paths don't match, the method returns a string describing the issue.
   * @param {any} obj1 The first object on which the path will be used.
   * @param {any} obj2 The second object on which the path will be used.
   * @param {{ end1: string; end2?: string }} ends An object that contains the path to both objects.
   * @returns {{ obj1: { } | []; obj2: { } | [] } | string} Returns an object, array, or other data type. Returns a string describing the error on error.
   */
  compareObjectsByPath(obj1, obj2, ends) {
    if (!ends || !ends.end1) return 'You didn\'t specify a path to traverse the objects!';
    if (!obj1 || !obj2) return 'You didn\'t specify objects to bypass!';
    if (!ends.end2) ends.end2 = ends.end1;

    const errPath = 'Path not found in one of the objects!';

    if (ends.end1 === ends.end2) {
      // Оба пути идентичны, можно идти по обоим объектам через end1
      const obj1AtPath = this.traverseObjectByPath(obj1, ends.end1);
      const obj2AtPath = this.traverseObjectByPath(obj2, ends.end2);

      if (obj1AtPath === null || obj2AtPath === null) {
        console.error(`${obj1AtPath == null ? 'The first object cannot complete the path.' : ''}${obj1AtPath == null && obj2AtPath == 0 ? '\n' : ''}${obj2AtPath == null ? 'The secont object cannot complete the path.' : ''}`);
        throw new Error(`${errPath}. For more precise work, add a second argument to "ends".`);
      }

      return { obj1: obj1AtPath, obj2: obj2AtPath };
    } else {
      // Пути разные, можно идти по каждому объекту по своему пути
      const obj1AtPath = this.traverseObjectByPath(obj1, ends.end1);
      const obj2AtPath = this.traverseObjectByPath(obj2, ends.end2);

      if (obj1AtPath === null || obj2AtPath === null) {
        console.error(`${obj1AtPath == null ? 'The first object cannot complete the path.' : ''}${obj1AtPath == null && obj2AtPath == 0 ? `\n` : ``}${obj2AtPath == null ? 'The secont object cannot complete the path.' : ''}`);
        throw new Error(`${errPath}. Check the objects and the path you specified.`);
      }

      return { obj1: obj1AtPath, obj2: obj2AtPath };
    }
  }

  /**
   * The `build` method is the main method that manages object comparison and returns the result of the comparison. If objects are compared without specified paths (`ends`), the method uses `findFirstArray` to find the first array in the objects and returns it. If the paths are specified in the `ends` object, the method uses `compareObjectsByPath` to compare the elements in the specified paths. The result of the comparison can be an object containing the elements being compared, or a string describing the error.
   * @returns {{ obj1: any, obj2: any } | string | string} Returns an object containing the result of the comparison, or a string describing the error that occurred.
   */
  build() {
    const ends = this.ends;

    if (!ends || !ends.end1 || ends.end1.length === 0 || !ends.end2 || ends.end2.length === 0) {
      const res = this.findFirstArray(this.repoData, this.data);

      if (res !== null) this.result = res;
    } else {
      const res = this.compareObjectsByPath(this.repoData, this.data, { end1: ends.end1, end2: ends.end2 });

      this.result = res;
    }
    return this.result;
  }
}