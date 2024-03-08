const welcomedMembers = new Set();
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    if (welcomedMembers.has(member.id)) {
      return;
    }

    welcomedMembers.add(member.id);

    try {
      const welcomeRole = member.guild.roles.cache.find(
        (role) => role.name === "user"
      );
      if (welcomeRole) {
        await member.roles.add(welcomeRole);
      } else {
        console.error("Welcome role not found in the server.");
      }

      const welcomeChannel = member.guild.channels.cache.find(
        (channel) => channel.name === "welcome"
      );
      if (!welcomeChannel) {
        console.error("Welcome channel not found in the server.");
        return;
      }

      const embed = new EmbedBuilder()
        .setColor("#7289DA")
        .setTitle(`Welcome to our server, ${member.user.username}! 🎉`)
        .setDescription(
          `We're thrilled to have you with us. Please take a moment to read the server rules and enjoy your stay! 🥳`
        )
        .addFields({
          name: "Member Info",
          value: `Username: ${member.user.username}\nTag: ${member.user.tag}\nID: ${member.user.id}`,
        })
        .setThumbnail(
          member.user.displayAvatarURL({
            format: "png",
            size: 256,
            dynamic: true,
          })
        )
        .setTimestamp();

      await welcomeChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error sending welcome message:", error);
    }
  },
};
