class Button {
  /**
   * @param {import("discord.js").Interaction} interaction 
   * @param {import("../../../client").BotClient} client 
   */
  constructor(interaction, client) {
    this.interaction = interaction;
    this.client = client;
    this.build();
  }

  /** @private */
  async build() {
    const interaction = this.interaction;
    const client = this.client;

    if (!interaction.isButton()) return;
  }
}

module.exports = { Button };