const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const { BaseEvent } = require("../../base/events");

const { applicationCommands } = Routes;

module.exports = class Ready extends BaseEvent {
  constructor() {
    super({ name: `ready` });
  }

  /** 
   * @param {import("../../client").BotClient} client
   * @returns {void}
   */
  execute(client) {
    if (!client || !client.user || !process.env.TOKEN) throw new TypeError(`client/client.user null | TOKEN not entered in .env file`);

    console.log(`${client.user.username} work.`);

    const rest = new REST({ version: `10` }).setToken(process.env.TOKEN);
    const slashCommands = client.commands;
    /** @type {[] | (SlashCommandBuilder | undefined)[]} */
    const slashComms = slashCommands.size > 0 ? slashCommands.map((i) => i.data) : [];

    rest.put(applicationCommands(client.user.id), { body: slashComms }).then(() => {
      console.log(`${client.commands.size} slash command registered.`);
      console.log(`Loaded ${client.events.size} events.`);
    }).catch(console.error);
  }
}
