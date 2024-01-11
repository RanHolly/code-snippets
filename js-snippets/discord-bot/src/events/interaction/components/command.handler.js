/** 
 * @typedef {import("discord.js").ChatInputCommandInteraction} ChatInputCommandInteraction 
 * @typedef {import("discord.js").InteractionResponse} InteractionResponse
 * @typedef {import("../../../client").BotClient} BotClient 
 */

class SlashCommand {
  /**
   * @param {ChatInputCommandInteraction} interaction 
   * @param {BotClient} client 
   */
  constructor(interaction, client) {
    this.build(interaction, client);
  }
  /**
   * @private
   * @param {ChatInputCommandInteraction} interaction 
   * @param {BotClient} client 
   * @returns {Promise<void | InteractionResponse>}
   */
  async build(interaction, client) {
    try {
      const slas_command = client.commands.get(interaction.commandName);
      const devId = ``;
      if (!slas_command) {
        return interaction.reply({ content: `There is no such command.`, ephemeral: true });
      }
      if (devId.length <= 17) throw new TypeError(`You did not enter the developer ID!`);
      if (slas_command.option.developer && interaction.user.id !== devId) {
        return interaction.reply({ content: `This command is only available to the bot developer.`, ephemeral: true });
      }

      await slas_command.execute(interaction, client);
    } catch (e) {
      console.error(e);
    }
  }
}

export { SlashCommand };
