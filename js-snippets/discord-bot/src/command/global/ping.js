const { BaseCommand } = require(`../../base/command`);

module.exports = class Ping extends BaseCommand {
  constructor() {
    super({ name: `ping`, description: `The ping command`, option: { category: `global` } });
  }

  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction 
   * @param {import("../../client").BotClient} client 
   */
  async execute(interaction, client) {
    await interaction.reply({ content: `Pong: ${Math.round(client.ws.ping)} ms.` });
  }
}