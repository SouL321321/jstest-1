const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dice-roll")
    .setDescription("Roll a dice. (1~6)"),

  async execute(interaction) {
    const choices = ["1 ", "2", "3", "4", "5", "6"];
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];

    const embed = new EmbedBuilder();

    try {
      switch (randomChoice) {
        case "1":
          embed
            .setTitle("🎲 | Your dice have been rolled...")
            .setColor("Green")
            .setDescription("Your number is **1**!");
          return interaction.reply({ embeds: [embed] });
        case "2":
          embed
            .setTitle("🎲 | Your dice have been rolled...")
            .setColor("Orange")
            .setDescription("Your number is **2**!");
          return interaction.reply({ embeds: [embed] });
        case "3":
          embed
            .setTitle("🎲 | Your dice have been rolled...")
            .setColor("Aqua")
            .setDescription("Your number is **3**!");
          return interaction.reply({ embeds: [embed] });
        case "4":
          embed
            .setTitle("🎲 | Your dice have been rolled...")
            .setColor("White")
            .setDescription("Your number is **4**!");
          return interaction.reply({ embeds: [embed] });
        case "5":
          embed
            .setTitle("🎲 | Your dice have been rolled...")
            .setColor("Black")
            .setDescription("Your number is **5**!");
          return interaction.reply({ embeds: [embed] });
        case "6":
          embed
            .setTitle("🎲 | Your dice have been rolled...")
            .setColor("Purple")
            .setDescription("Your number is **6**!");
          return interaction.reply({ embeds: [embed] });
      }
    } catch (err) {
      console.log(err);

      embed.setColor("Red").setDescription("⛔ | Something went wrong...");

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
