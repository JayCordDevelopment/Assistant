const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, userMention } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purge messages from a channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addNumberOption(option => option.setName('amount').setDescription('Amount to purge.').setMaxValue(100).setMinValue(1).setRequired(true))
    .addUserOption(option => option.setName('target').setDescription('User to purge.')),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { channel, options } = interaction;

        const Amount = options.getNumber('amount');
        const Target = options.getUser('target');

        const Messages = await channel.messages.fetch();

        const PurgeEmbed = new EmbedBuilder()

        if (Target) {
            let i = 0;
            const Filtered = [];
            Messages.filter((m) => {
                if (m.author.id === Target.id && Amount > i){
                    Filtered.push(m);
                    i++;
                };
            });

            await channel.bulkDelete(Filtered, true).then(async messages => {
                await interaction.reply({ embeds: [PurgeEmbed.setColor('Green').setDescription(`${Emojis.Success_Emoji} Purged ${messages.size} ${messages.size > 1 ? 'messages' : 'message'} sent by ${userMention(Target.id)}`)],ephemeral: true });
            });
        }
        else {
            await channel.bulkDelete(Amount, true).then(messages => {
                interaction.reply({ embeds: [PurgeEmbed.setColor('Green').setDescription(`${Emojis.Success_Emoji} Purged ${messages.size} ${messages.size > 1 ? 'messages' : 'message'}`)], ephemeral: true });
            });
        };
    },
};