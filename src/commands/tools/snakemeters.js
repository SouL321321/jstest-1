const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("snakemeters")
    .setDescription(`Show the name and length of the "snake"🐍👀`),
  async execute(interaction) {
    const snakeLength = Math.min(Math.floor(Math.random() * 40) + 1, 40);

    const snakeRepresentation = generateSnake(snakeLength);

    const embed = new EmbedBuilder()
      .setColor("#4CAF50")
      .setTitle("Snake Length")
      .setDescription(`Your snake is **${snakeLength} cm long!**👀`)
      .addFields({ name: "Snake Representation", value: snakeRepresentation })
      .setFooter({
        text: "Enjoy your snake size! 🐍",
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};

function generateSnake(length) {
  const snakeParts = ["🐍", "🛫", "🌿", "🔫", "🦖"];

  return Array.from(
    { length },
    (_, index) => snakeParts[index % snakeParts.length]
  ).join(" ");
}
