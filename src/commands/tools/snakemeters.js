const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("snakemeters")
    .setDescription(`Show the name and length of the "snake"👀`),
  async execute(interaction) {
    // Limit the snake length to a maximum of 40 cm
    const snakeLength = Math.min(Math.floor(Math.random() * 40) + 1, 40);

    // Create a graphical representation of the snake length using emoji (e.g., 🐍)
    const snakeRepresentation = "🐍".repeat(snakeLength);

    // Create a message with the name, snake length, and graphical representation
    const message = `Your snake is **${snakeLength} cm long!**\n${snakeRepresentation}`;

    // Send the message
    await interaction.reply(message);
  },
};
