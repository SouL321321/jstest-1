const { SlashCommandBuilder } = require("discord.js");
const { Connect4 } = require("discord-gamecord");
module.exports = {
  countdown: true,
  data: new SlashCommandBuilder()
    .setName(`connect4`)
    .setDescription(`Play a game of connect 4`)
    .addUserOption((options) =>
      options
        .setName("opponent")
        .setDescription("The user you want to play this game against.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const Game = new Connect4({
      message: interaction,
      isSlashGame: true,
      opponent: interaction.options.getUser("opponent"),
      embed: {
        title: "Connect4 Game",
        description: "Connect 4 tokens in horizontal, vertical or diagonal.",
        statusTitle: "Status",
        color: "#5865F2",
      },
      emojis: {
        board: "⚪",
        player1: "🔴",
        player2: "🟡",
      },
      mentionUser: true,
      timeoutTime: 300000,
      buttonStyle: "PRIMARY",
      turnMessage: "{emoji} | Its turn of player **{player}**.",
      winMessage: "{emoji} | **{player}** won the Connect4 Game.",
      tieMessage: "The Game tied! No one won the Game!",
      timeoutMessage: "The Game went unfinished! No one won the Game!",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
    });

    Game.startGame();
  },
};
