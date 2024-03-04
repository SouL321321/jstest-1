const welcomedMembers = {};
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const welcomeChannelId = process.env.WELCOME;
    const totalMembers = member.guild.memberCount;

    if (welcomedMembers[member.id]) {
      return;
    }

    welcomedMembers[member.id] = true;

    try {
      const channel = await member.guild.channels.fetch(welcomeChannelId);

      const embed = new EmbedBuilder()
        .setColor("#7289DA")
        .setTitle(`Welcome to our server, ${member.user.username}! 🎉`)
        .setDescription(
          `We're thrilled to have you with us. Please take a moment to read the server rules and enjoy your stay! 🥳\n\n`
        )
        .addFields(
          {
            name: "Channel to Visit",
            value:
              "Feel free to explore available channels like #general and #fun.",
          },
          {
            name: "Assistance",
            value:
              "For assistance, feel free to contact the staff or use the /help command.",
          }
        )
        .setImage(
          member.user.displayAvatarURL({
            format: "png",
            size: 512,
            dynamic: true,
          })
        )
        .setFooter({
          text: `You are the ${totalMembers}${
            totalMembers === 1 ? "st" : "th"
          } member of this server!`,
        });

      await channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error sending welcome message:", error);
    }
  },
};
