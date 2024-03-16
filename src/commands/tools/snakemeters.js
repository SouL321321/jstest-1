const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("snakemeters")
    .setDescription(`Show the name and length of the "snake"🐍👀`),
  async execute(interaction) {
    // Limit the snake length to a maximum of 40 cm
    const snakeLength = Math.min(Math.floor(Math.random() * 40) + 1, 40);

    // Create a graphical representation of the snake length using a combination of emoji and characters
    const snakeRepresentation = generateSnake(snakeLength);

    // Create an embed for a more aesthetic presentation
    const embed = new EmbedBuilder()
      .setColor("#4CAF50") // Green color
      .setTitle("Snake Length")
      .setDescription(`Your snake is **${snakeLength} cm long!**👀`)
      .addFields({ name: "Snake Representation", value: snakeRepresentation })
      .setFooter({
        text: "Enjoy your snake size! 🐍",
        iconURL: interaction.user.displayAvatarURL(),
      });

    // Send the embed as a reply
    await interaction.reply({ embeds: [embed] });
  },
};

// Function to generate a creative snake representation
function generateSnake(length) {
  // Array of snake body parts (you can customize this array)
  const snakeParts = ["◉", "●", "■", "▓", "▒"];

  // Generate the snake representation based on the length
  return Array.from(
    { length },
    (_, index) => snakeParts[index % snakeParts.length]
  ).join(" ");
}
