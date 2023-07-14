const { Message } = require("discord.js");
const PF = require("../../../handlers/Client");

module.exports = {
  name: "ping",
  aliases: [],
  description: `see the bot\'s latency`,
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["EMBED_LINKS"],
  category: "information",
  cooldown: 2.5,

  /**
  *
  * @param {PF} client
  * @param {Message} message
  * @param {String[]} args
  * @param {String} prefix
  */
  run: async (client, message, args, prefix) => {
    client.embed(message, `Ping: **\`${client.ws.ping}\`**`);
  },
}