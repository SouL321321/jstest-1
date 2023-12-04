const {
  SlashCommandBuilder,
  UserSelectMenuBuilder,
  ActionRowBuilder,
  ContextMenuCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user_menu")
    .setDescription("Return a user!"),
  async execute(interaction, client) {
    //Menu
    const userMenu = new UserSelectMenuBuilder()
      .setCustomId(`user-menu`)
      .setPlaceholder("Select multiple users.")
      .setMinValues(1)
      .setMaxValues(20);

    const row = new ActionRowBuilder().addComponents(userMenu);
    await interaction.reply({
        content: "Select user and details of your profile:",
        components: [row],
        embeds: [embed],
    });
  },
};

