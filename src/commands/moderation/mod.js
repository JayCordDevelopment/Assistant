const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
const { Emojis } = require('../../config.json');
const randomstring = require('randomstring');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('Moderate a user\'s name.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .setDMPermission(false)
    .addUserOption(option => option.setName('target').setDescription('User to moderate.').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const TargetUser = options.getUser('target') || user;
        const TargetMember = await guild.members.fetch(TargetUser.id);

        const CannotDoActionEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} I cannot moderate this user's nickname.`)
        if (!TargetMember.manageable) return interaction.reply({ embeds: [CannotDoActionEmbed] });

        const ModeratedNickname_ID = randomstring.generate({ length: 5, charset: 'alphanumeric' });
        await TargetMember.setNickname(`Moderated Nickname - ${ModeratedNickname_ID}`);

        const ModSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Emojis.Success_Emoji} Nickname moderated to ${inlineCode(`Moderated Nickname - ${ModeratedNickname_ID}`)}`)
        interaction.reply({ embeds: [ModSuccessEmbed] });
    },
};
