const { readdir } = require("fs/promises");
const { resolve } = require("path");
const { isClass } = require("../utils");

/** 
 * @typedef {import("../utils.js").ArrayPathLimit<string, 2>} ArrayPathLimit 
 * @typedef {import("../client").BotClient} BotClient
 * @typedef {import("../utils").ModuleType} ModuleType
 */

class BaseHandler {
  /** @type {BotClient} */
  client;
  /** @type {ArrayPathLimit} */
  folderPath;
  /** @type {RegExp} */
  filterFile;

  /** @param {BotClient} client */
  constructor(client) {
    this.client = client;
    this.folderPath = [`srcJs`, `сommands`];
    this.filterFile = /^[^.]+\.(js)$/;
  }

  /**
   * Метод для изменения фильтра
   * @param {RegExp} filter
   * @returns {void}
   * @default /^[^.]+\.(js)$/
   */
  setFilter(filter) {
    if (filter) this.filterFile;
  }

  /**
   * Метод для изменения пути поиска
   * @param {ArrayPathLimit} path
   * @default [`src`,`Command`]
   */
  setFolderPath(path) {
    if (path) this.folderPath = path;
  }

  /**
   * @param {ModuleType} modules
   * @returns {void | null | Promise<void | null>}
   */
  setLogic(modules) {
    throw new TypeError(`Вы не реализовали setLogic!`);
  }

  /** @returns {Promise<void>} */
  async build() {
    /** @type {string[]} */ // Perhaps it feels like a crutch. But in a different way he wants [Symbol.iterator](). I haven't noticed anything like this in TS (or .d.ts file's) =_= 
    const paths = this.folderPath; 
    const folders = resolve(...paths);
    const foldersScan = await readdir(folders);

    try {
      for (const folder of foldersScan) {
        const files = resolve(folders, folder);
        const fileScan = (await readdir(files)).filter((file) => this.filterFile.test(file));

        for (const file of fileScan) {
          const FileModule = require(`../${this.folderPath[1]}/${folder}/${file}`);

          if (!isClass(FileModule)) {
            console.error(`File ${file} is not a class!`);
            continue;
          }

          /** @type {ModuleType} */
          const modules = new FileModule();
          const logic = await this.setLogic(modules);

          if (logic === null) continue;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = { BaseHandler };
