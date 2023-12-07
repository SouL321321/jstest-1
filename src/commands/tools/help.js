const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show all available commands"),

  async execute(interaction) {
    try {
      const commands = interaction.client.commands;

      const commandList = commands.map((command) => `• ${command.data.name}`);

      const embed = new EmbedBuilder()
        .setTitle("🆘**Available Commands**🆘")
        .setDescription(commandList.join("\n"))
        .setColor(0xc0c0c0);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error executing /help command: ${error.message}`);
      await interaction.reply("An error occurred while executing the command.");
    }
  },
};
