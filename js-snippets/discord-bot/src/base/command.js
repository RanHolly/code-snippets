const { SlashCommandBuilder } = require("discord.js");

/** @typedef {import("../utils.js").ArrayNotEmpty<string>} ArrayNotEmpty */
/** @typedef {import("../utils.js").ArrayMaybeEmpty<string>} ArrayMaybeEmpty */

class BaseCommand {
  /** 
   * **data** - SlashCommandBuilder. If you need to add some parameters, call `this.data` in the constructor of the command class.
   * @type {SlashCommandBuilder} 
   */
  data = new SlashCommandBuilder();
  /** 
   * Command Name 
   * @type {string}
   */
  name;

  /**
   * @typedef {object} CommandClassOptions
   * Available command options:
   * - **category** (required), 
   * - **developer** (optional, like the others listed), 
   * - **owner**, 
   * - **administrator**, 
   * - **moderator**, 
   * - **moderators** (only if `moderator: true`), 
   * - **testers** (only if `test: true`).
   * 
   * Everything optional is **false** by default (except **arrays**, they're just **empty**)
   * @property {string} category **category** - category command
   * @property {boolean} [developer = false] **developer** - This command is available to the developer
   * @property {boolean} [owner = false] **owner** - This command is only available to the server owner
   * @property {boolean} [admin = false] **admin** - This command is available to those with admin rights
   * @property {boolean} [moderator = false] **moderator** - This command is available to moderators or those with administrator rights
   * @property {ArrayMaybeEmpty} [moderators = []] **moderators** - This is an array of moderator role IDs
   * @property {boolean} [test = false] **test** - this is a test command (available only to testers and developer(s)))
   * @property {ArrayMaybeEmpty} [testers = []] **testers** - array of id testers who will have access to this command
   */

  /** @typedef {{name: string, description?: string, option: CommandClassOptions}} CommandOptions */

  /** @type {CommandClassOptions} */
  option;

  /**
   * Base Command Class
   * @param {CommandOptions} commandOptions
   * Example used:
   * ```js
   * //обычная команда
   * const { BaseCommand } = require("../Base/command");
   * 
   * module.exports = class SomeCommand extends BaseCommand {
   *  constructor() {
   *    super({ name: `somecommand`, option: { category: `global` } });
   *  }
   *    
   *  // and here the jsdoc, but it will not be in the example (since it will break this JSDoc)
   *  execute(interaction, client) {
   *    interaction.reply({ content: `You used someCommand!` });
   *  }
   * }
   *```
   */
  constructor({ name, description, option }) {
    if (!name) throw new TypeError(`Вы не указали имя команды!`);
    if (!option || Object.entries(option).length === 0) throw new TypeError(`Вы не указали параметры для команды!`);

    this.name = name;
    this.data = new SlashCommandBuilder();
    //this.db = new Database();
    this.option = {
      category: option.category ?? `global`, /* global == member level using command. 
      But you can replace it with another name. There is no “fixed” \name for “level” available to everyone. For moderation, administration, testing or developer use only. 
      P.S. Maybe I'll make it an array. Don't know. My head doesn't "cook" (work) well at 2 am. However, for now it will just be the string.
      P.S. Why do I use \ before the name? Because `name` is reserved globally, and Eslint complains about using `name` in a multiline comment (on `global` too)*/
      developer: option.developer ?? false,
      admin: option.admin ?? false,
      moderator: option.moderator ?? false,
      moderators: option.moderators || [],
      test: option.test ?? false,
      testers: option.testers || [],
      owner: option.owner ?? false,
    };

    this.data.setName(name);
    if (description) this.data.setDescription(description);
  }

  /**
   * @param {...any} args
   * @returns {void | Promise<void>}
   */
  execute(...args) {
    throw new TypeError(`You haven't implemented your execute for [${this.name || `Error`}] command!`);
  }
}

module.exports = { BaseCommand };
