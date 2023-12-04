const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("menu")
    .setDescription("Return a select menu!"),
  async execute(interaction, client) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`sub-menu`)
      .setMinValues(1)
      .setMaxValues(3)
      .addOptions([
        {
          label: `Option #1`,
          value: `https://discord.gg/TRSjYBvj`,
        },
        {
          label: `Option #2`,
          value: `https://discord.gg/HxxF5dzD`,
        },
        {
          label: `Option  #3`,
          value: `https://discord.com/developers/docs/intro`,
        },
      ]);

      await interaction.reply({
        components: [new ActionRowBuilder().addComponents(menu)]
      });
  },
};
