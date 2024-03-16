const { SlashCommandBuilder } = require("discord.js");
const { Trivia } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("trivia")
  .setDescription("Start a game to trivia"),

  async execute(interaction) {
    const Game = new Trivia({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Trivia",
        color: "#5865F2",
        description: "You have 20 secs to guess the answer."
      },
      timeoutTime: 20000,
      buttonStyle: "PRIMARY",
      trueButtonStyle: "SUCCESS",
      falseButtonStyle: "DANGER",
      mode: "multiple",
      difficulty: "medium",
      winMessage: "You won! The correct answer is {answer}.",
      loseMessage: "You lost! The correct answer is {answer}.",
      errMessage: "Unable to fetch question data! Please try again.",
      playerOnlyMessage: "only {player} can use the these buttons."
    });

    Game.startGame();
    Game.on("GameOver", result => {
      console.log(result);
    });
  }
};