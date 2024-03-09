const { SlashCommandBuilder } = require("discord.js");
const { registerUser } = require("../auth/auth-diary");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register for a diary account.")
    .addStringOption((option) =>
      option
        .setName("password")
        .setDescription("Choose a diary password.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.user;
    const password = interaction.options.getString("password");

    try {
      const success = await registerUser(user.id, password);

      if (success) {
        await interaction.reply(
          "You have successfully registered for your diary!"
        );
      } else {
        await interaction.reply("Registration failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      await interaction.reply(
        "An error occurred during registration. Please try again later."
      );
    }
  },
};
