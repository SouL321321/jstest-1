const { SlashCommandBuilder } = require("discord.js");
const { GuessThePokemon } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guess-the-pokemon")
    .setDescription("Start a game to guess the Pokemon."),

  async execute(interaction) {
    try {
      const game = new GuessThePokemon({
        isSlashGame: true,
        message: interaction,
      });
      await game.startGame();
    } catch (error) {
      console.error("Error starting the game:", error);
      await interaction.reply("An error occurred while starting the game.");
    }
  },
};
