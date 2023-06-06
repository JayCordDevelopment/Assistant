const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('key')
    .setDescription('Give an office key to someone.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to give the key to.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('key')
            .setDescription('The key to give.')
            .setRequired(true)
            .addChoices(
                { name: 'Jay\'s Office Key', value: 'jays-office-key' }
            )
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const TargetUser = options.getUser('target');
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const Key = options.getString('key');

        switch (Key) {
            case 'jays-office-key':
                const CannotDoActionEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Unable to perform action.`)
                if (TargetMember.roles.cache.has('1101869412010704907') || !TargetMember.manageable) return interaction.reply({
                    embeds: [CannotDoActionEmbed]
                });

                TargetMember.roles.add('1101869412010704907');

                const KeyGivenEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been given the key to Jay's Office.`)
                interaction.reply({
                    embeds: [KeyGivenEmbed]
                });
                break;
        };
    },
};
