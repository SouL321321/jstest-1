const { SlashCommandBuilder } = require("discord.js");
const { GuessThePokemon } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guess-the-pokemon")
    .setDescription("Start a game to guess the Pokemon."),

  async execute(interaction) {
    try {
      const game = new GuessThePokemon({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "Whos The Pokemon",
          color: "#5865F2",
        },
        timeoutTime: 30000,
        winMessage: "You guessed it right! It was a {pokemon}.",
        loseMessage: "Better luck next time! It was a {pokemon}.",
        errMessage: "Unable to fetch pokemon data! Please try again.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });
      await game.startGame();
      game.on("GameOver", (result) => {
        return;
      });
    } catch (error) {
      console.error("Error starting the game:", error);
      await interaction.reply("An error occurred while starting the game.");
    }
  },
};
