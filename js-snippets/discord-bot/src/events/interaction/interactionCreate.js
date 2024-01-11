const { BaseEvent } = require(`../../base/events`);
const { Button } = require(`./components/button`);
const { Modal } = require(`./components/modal`);
const { Menu } = require(`./components/menu`);
const { SlashCommand } = require(`./components/command.handler`);

module.exports = class InteractionCreate extends BaseEvent {
  constructor() {
    super({ name: `interactionCreate` });
  }

  /** 
   * @param {import("discord.js").Interaction} interaction
   * @param {import("../../client").BotClient} client
   */
  execute(interaction, client) {
    new Button(interaction, client);
    new Modal(interaction, client);
    new Menu(interaction, client);
    new SlashCommand(interaction, client);
  }
}