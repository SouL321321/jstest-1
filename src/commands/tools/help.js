const { SlashCommandBuilder } = require("@discordjs/builders");
const { StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show all available commands"),

  async execute(interaction) {
    try {
      const commands = interaction.client.commands;
      const options = [];

      commands.forEach((command) => {
        options.push({
          label: command.name,
          value: command.name,
        });
      });

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("helpMenu")
        .setPlaceholder("Select a command...")
        .addOptions(options);

      await interaction.reply({
        content: "Here is the list of commands:",
        components: [selectMenu],
      });
    } catch (error) {
      console.error(`Error executing /help command: ${error.message}`);
      await interaction.reply("An error occurred while executing the command.");
    }
  },
};
