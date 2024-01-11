const { BaseHandler } = require(`../base/handler`);

class EventHandler extends BaseHandler {
  /** @param {import("../client").BotClient} client */
  constructor(client) {
    super(client);
    this.client = client;
    this.setFolderPath([`srcJs`, `events`]);
    this.build();
  }

  /**
   * @param {import("../utils").BaseEvent} event
   * @returns {null | void}
   */
  setLogic(event) {
    const client = this.client;
    try {
      client.events.set(event.name, event.name); // Just for the counter of running events
      client[event.once == true ? `once` : `on`](event.name, async (/** @type {any[]} */...args) => await event.execute(...args, client));
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

module.exports = { EventHandler };
