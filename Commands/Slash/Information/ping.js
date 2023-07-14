const { CommandInteraction } = require("discord.js");
const PF = require("../../../handlers/Client");

module.exports = {
    name: "ping",
    description: `see the bot\'s latency`,
    userPermissions: ["SEND_MESSAGES"],
    botPermissions: ["EMBED_LINKS"],
    category: "Information",
    cooldown: 5,
    type: "CHAT_INPUT",

    /**
    *
    * @param {PF} client
    * @param {CommandInteraction} interaction
    * @param {String[]} args
    */
    run: async (client, interaction, args) => {
        client.embed(interaction, `Ping: **\`${client.ws.ping}\`**`);
    },
}