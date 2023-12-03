const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("menu")
    .setDescription("Return a select menu!"),
  async execute(interaction, client) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`sub-menu`)
      .setMinValues(0)
      .setMaxValues(1)
      .setOptions(
        new StringSelectMenuOptionBuilder(
          {
            label: `Option #1`,
            value: `https://discord.gg/TRSjYBvj`,
          },
          {
            label: `Option #2`,
            value: `https://discord.gg/HxxF5dzD`,
          },
        )
      );

      await interaction.reply({
        components: [new ActionRowBuilder().addComponents(menu)]
      });
  },
};
