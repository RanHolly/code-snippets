const { BaseHandler } = require("../base/handler");

class CommandHandler extends BaseHandler {
  /** @param {import("../client").BotClient} client */
  constructor(client) {
    super(client);
    this.client = client;
    this.client.commands.clear();

    this.setFolderPath([`srcJs`, `commands`]);
    this.build();
  }

  /** 
   * @param {import("../base/command").BaseCommand} command 
   * @returns {void}
   */
  setLogic(command) {
    try {
      this.client.commands.set(command.name, command);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = { CommandHandler };
