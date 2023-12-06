const welcomedMembers = {};

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

      await channel.send({
        content: `<@${member.id}> Welcome to the server, ${member.user.username}! You are the ${totalMembers}th member. Follow the rules and have fun here! 🥳\r\r\r\r\r\r`,
        files: [
          {
            attachment: member.user.displayAvatarURL({
              format: "png",
              size: 512,
            }),
            name: `${member.id}-welcome.png`,
          },
        ],
      });
    } catch (error) {
      console.error("Error sending welcome message:", error);
    }
  },
};
