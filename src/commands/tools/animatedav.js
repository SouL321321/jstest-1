const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const authorizedUsers = process.env.DEVELOPERS_ID.split(",");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("animated-avatar")
    .setDescription("Animate an avatar for your bot🪐")
    .addAttachmentOption((option) =>
      option
        .setName("avatar")
        .setDescription("The avatar to animate")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    try {
      if (!authorizedUsers.includes(interaction.user.id)) {
        await interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
        return;
      }

      await interaction.deferReply({ ephemeral: true });

      const { options } = interaction;
      const avatar = options.getAttachment("avatar");

      async function sendMessage(message) {
        const embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(message);

        await interaction.editReply({ embeds: [embed] });
      }

      if (!avatar.contentType || !avatar.contentType.includes("gif")) {
        await sendMessage(`⚠️ Please use a gif format for animated avatars.`);
        return;
      }

      var error;
      await client.user.setAvatar(avatar.url).catch(async (err) => {
        error = true;
        console.log(err);
        await sendMessage(`⚠️ Error: \`${err.toString()}\``);
      });

      if (!error) {
        await sendMessage(`🌍 I have uploaded your avatar.`);
      }
    } catch (error) {
      console.error("Error executing command:", error);
      interaction.followUp({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
