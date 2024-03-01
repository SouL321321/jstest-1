const { SlashCommandBuilder } = require("discord.js");
const { RockPaperScissors } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rock-paper-scissors")
    .setDescription("Play a game of rock(👊) - paper(✋) - scissors(✌)")
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("The person to play against")
        .setRequired(true)
    ),

  async execute(interaction) {
    const opponent = interaction.options.getUser("opponent");

    const Game = new RockPaperScissors({
      message: interaction,
      isSlashGame: true,
      opponent: opponent,
      embed: {
        title: "Rock Paper Scissors",
        color: "#5865F2",
        description: "Press a button below to make a choice.",
      },
      buttons: {
        rock: "Rock",
        paper: "Paper",
        scissors: "Scissors",
      },
      emojis: {
        rock: "👊",
        paper: "✋",
        scissors: "✌",
      },
      mentionUser: true,
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      pickMessage: "You choose {emoji}.",
      winMessage: "**{player}** won the Game! Congratulations!🤝",
      tieMessage: "The game tied! No one won the Game!🤝",
      timeoutMessage: "The Game went unfinished! No one won the Game!",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
    });

    Game.startGame();
    Game.on("gameOver", (result) => {
      console.log(result);
    });
  },
};
