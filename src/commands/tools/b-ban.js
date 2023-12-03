const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("b-ban")
    .setDescription("Ban someone!")
    .addUserOption((option) =>
      option.setName("ban").setDescription("User to ban").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for ban")
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("ban");
    const reason = interaction.options.getString("reason") ?? "No reason provided";

    const confirmButton = new ButtonBuilder()
      .setCustomId("confirm")
      .setLabel("Confirm Ban")
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(cancelButton, confirmButton);

    await interaction.reply({
      content: `Are you sure you want to ban ${target.tag} for reason: ${reason}?`,
      components: [row],
    });

    const filter = (button) => button.customId === 'confirm' || button.customId === 'cancel';
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (button) => {
      if (button.customId === 'confirm') {
        await interaction.followUp(`User ${target.tag} has been banned for reason: ${reason}`);
        // Esegui qui il codice per effettuare il ban
      } else {
        await interaction.followUp('Ban operation canceled.');
      }
      collector.stop();
    });

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        interaction.followUp('Ban operation timed out. Please try again.');
      }
    });
  },
};