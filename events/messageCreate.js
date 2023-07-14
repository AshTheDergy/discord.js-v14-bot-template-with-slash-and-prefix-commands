const {
    cooldown,
    databasing,
    toPascalCase,
} = require("../handlers/functions");
const client = require('..');
const { PREFIX: botPrefix, emoji } = require("../settings/config");
const { PermissionFlagsBits } = require("discord.js");

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild || !message.id) return;
    await databasing(message.guildId, message.author.id);
    let settings = await client.server.get(message.guild.id);
    let prefix = settings?.prefix || botPrefix;
    let mentionprefix = new RegExp(
        `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!mentionprefix.test(message.content)) return;
    const [, nprefix] = message.content.match(mentionprefix);
    const args = message.content.slice(nprefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) {
        if (nprefix.includes(client.user.id)) {
            client.embed(
            message,
            `${emoji.success} To See My All Commands Type  \`/help\` or \`${prefix}help\``
          );
        };
    };
    const command =
    client.mcommands.get(cmd) ||
    client.mcommands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
    if (!command) return;
    if (command) {
        if (
            !message.member.permissions.has(
                PermissionFlagsBits[toPascalCase(command.userPermissions[0])] || []
            )
        ) {
            return client.embed(
                message,
                `You Don't Have \`${command.userPermissions}\` Permission to Use \`${command.name}\` Command!!`
            );
        } else if (
            !message.guild.members.me.permissions.has(
                PermissionFlagsBits[toPascalCase(command.botPermissions[0])] || []
            )
        ) {
            return client.embed(
                message,
                `I Don't Have \`${command.botPermissions}\` Permission to Use \`${command.name}\` Command!!`
            );
        } else if (cooldown(message, command)) {
            return client.embed(
                message,
                `You are On Cooldown , wait \`${cooldown(
                message,
                command
              ).toFixed()}\` Seconds`
            );
        } else {
            command.run(client, message, args, nprefix);
        };
    };
});

function escapeRegex(newprefix) {
    return newprefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
//nice :)