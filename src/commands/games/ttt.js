const { SlashCommandBuilder } = require("discord.js");
const { TicTacToe } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tic-tac-toe")
    .setDescription("Start a Tic-Tac-Toe game.")
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("The opponent")
        .setRequired(true)
    ),
  async execute(interaction) {
    const opponent = interaction.options.getUser("opponent");

    if (opponent.id === interaction.user.id) {
      return await interaction.reply({
        content: "You can't play against yourself!",
        ephemeral: true,
      });
    }

    if (opponent.bot) {
      return await interaction.reply({
        content: "You can't play against bot!",
        ephemeral: true,
      });
    }

    const Game = new TicTacToe({
      message: interaction,
      isSlashGame: true,
      opponent: interaction.options.getUser("opponent"),
      embed: {
        title: "❌Tic Tac Toe🔵",
        color: "#5865f2",
        statusTitle: "Status",
        overTitle: "Game Over",
      },
      emojis: {
        xButton: "❌",
        oButton: "🔵",
        blankButton: "➖",
      },
      mentionUser: true,
      timeoutTime: 60000,
      xButtonStyle: "DANGER",
      oButtonStyle: "PRIMARY",
      turnMessage: "{emoji} | Its turn of player **{player}**.",
      winMessage: "{emoji} | **{player}** won the TicTacToe Game.",
      tieMessage: "The Game tied! No one won the Game!",
      timeoutMessage: "The Game went unfinished! No one won the Game!",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
    });

    Game.startGame();
    Game.on("gameOver", (result) => {
      console.log(result);
    });
  },
};
