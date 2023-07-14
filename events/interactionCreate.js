const client = require("../index");
const {
    cooldown,
    databasing,
    toPascalCase,
} = require("../handlers/functions");
const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} = require("discord.js");
const { emoji } = require('../settings/config');

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch((e) => {});
        await databasing(interaction.guildId, interaction.user.id);
        const cmd = client.commands.get(interaction.commandName);
        if (!cmd) 
            return client.embed(
                interaction,
                `${emoji.error} \`${interaction.commandName}\` Command Not Found `
            );
        const args = [];
        for (let option of interaction.options.data) {
            if (option.type === ApplicationCommandOptionType.Subcommand) {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        };
        interaction.member = interaction.guild.members.cache.get(
            interaction.user.id
        );

        if (cmd) {
            if (
                !interaction.member.permissions.has(
                    PermissionFlagsBits[toPascalCase(cmd.userPermissions[0])] || []
                )
            ) {
                return client.embed(
                    interaction,
                    `You Don't Have \`${cmd.userPermissions}\` Permission to Use \`${cmd.name}\` Command!!`
                ); 
            } else if (
                !interaction.guild.members.me.permissions.has(
                    PermissionFlagsBits[toPascalCase(cmd.botPermissions[0])] || []
                )
            ) {
                return client.embed(
                    interaction,
                    `I Don't Have \`${cmd.botPermissions}\` Permission to Use \`${cmd.name}\` Command!!`
                );
            } else if (cooldown(interaction, cmd)) {
                return client.embed(
                    interaction,
                    `You are On Cooldown , wait \`${cooldown(
                    interaction,
                    cmd
                    ).toFixed()}\` Seconds`
                );
            } else {
                cmd.run(client, interaction, args);
            };
        };
    };

    if (interaction.isContextMenuCommand()) {
        await interaction.deferReply({ ephemeral: true }).catch((e) => {});
        const command = client.commands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
});