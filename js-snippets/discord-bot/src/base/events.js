class BaseEvent {
  /**
   * Event name 
   * @type {string} 
   */
  name;
  /**
   * Сall only once?
   * @type {boolean}
   */
  once;

  /**
   * @param {object} options
   * @param {string} options.name event name
   * @param {boolean} [options.once=false] call only once?
   */
  constructor({ name, once }) {
    this.name = name;
    this.once = once ?? false;
  }

  /**
   * @param {...any} args
   * @returns {void | Promise<void>}
   */
  execute(...args) {
    throw new TypeError(`${this?.name || [`Error`]} does not implement the execute method!`);
  }
}

module.exports = { BaseEvent };
