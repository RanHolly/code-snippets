const { Client, Collection, GatewayIntentBits } = require(`discord.js`);
const { EventHandler } = require(`../handlers/event`);
const { CommandHandler } = require(`../handlers/command`);

class BotClient extends Client {
  /** @type {Collection<string, string>} */
  events = new Collection();
  /** @type {Collection<string, import("../utils.js").BaseCommand>} */
  commands = new Collection();

  /** @param {import("discord.js").ClientOptions} options */
  constructor(options) {
    super(options);

    new EventHandler(this);
    new CommandHandler(this);
  }
}

module.exports = { BotClient };

const client = new BotClient({ intents: [GatewayIntentBits.Guilds] });
client.login(process.env.TOKEN);
