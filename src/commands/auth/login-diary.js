const { SlashCommandBuilder } = require("discord.js");
const { authenticateUser } = require("../auth/auth-diary");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("login")
    .setDescription("Login to your account.")
    .addStringOption((option) =>
      option
        .setName("password")
        .setDescription("Your password.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.user;
    const password = interaction.options.getString("password");

    try {
      await authenticateUser(user.id, password);
      await interaction.reply("You have successfully logged in!");
    } catch (error) {
      await interaction.reply(
        "Authentication failed. Please check your credentials or register ur new personal account."
      );
    }
  },
};
