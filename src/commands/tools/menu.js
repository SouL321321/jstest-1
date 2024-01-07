const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("menu")
    .setDescription("Return a select menu!"),
    async execute (interaction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`sub-menu`)
      .setMinValues(1)
      .setMaxValues(4)
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
        {
          label: `Option #4`,
          value: `https://raw.githubusercontent.com/SouL321321/jstest-1/main/index.html`,
        },
      ]);

    await interaction.reply({
      components: [new ActionRowBuilder().addComponents(menu)],
    });
  },
};
