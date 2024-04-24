const { SlashCommandBuilder } = require("discord.js");
const { Trivia } = require("discord-gamecord");

module.exports = {
  countdown: true,
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Start a game of trivia"),

  async execute(interaction) {
    const Game = new Trivia({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Trivia",
        color: "#5865F2",
        description: "⏲ You have 20 secs to guess the answer.",
      },
      timeoutTime: 20000,
      buttonStyle: "PRIMARY",
      trueButtonStyle: "SUCCESS",
      falseButtonStyle: "DANGER",
      mode: "multiple",
      difficulty: "medium",
      winMessage: "✅ You won!\n The correct answer is {answer}.",
      loseMessage: "❌ You lost!\n The correct answer is {answer}.",
      errMessage: "🚫 Unable to fetch question data! Please try again.",
      playerOnlyMessage: "only {player} can use these buttons.",
    });

    Game.startGame();
    Game.on("GameOver", (result) => {
      const embedColor = result.win ? "#00FF00" : "#FF0000";
      const embed = {
        title: "Trivia",
        color: embedColor,
        description: result.win ? Game.winMessage : Game.loseMessage,
      };
      interaction.reply({ embeds: [embed] });
    });

    Game.on("GameTimeout", () => {
      const embed = {
        title: "Trivia",
        color: "#FFFF00", // Yellow color for timeout
        description: "⌛ Time's up!",
      };
      interaction.reply({ embeds: [embed] });
    });
  },
};
