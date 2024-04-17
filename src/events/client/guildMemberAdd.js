const { EmbedBuilder } = require("discord.js");
const GuildConfig = require("../../models/guildConfig");

module.exports = {
  async execute(member) {
    try {
      console.log(`guildMemberAdd event received for guild ${member.guild.name}`);

      const guildConfigCount = await GuildConfig.countDocuments({ guildId: member.guild.id });
      console.log(`GuildConfig count for guild ${member.guild.name}:`, guildConfigCount);

      if (guildConfigCount > 1) {
        console.warn(`Multiple GuildConfig documents found for guild ${member.guild.name}.`);
      }

      const guildConfig = await GuildConfig.findOne({
        guildId: member.guild.id,
      });

      if (!guildConfig) {
        console.error("Configuration not found for this guild.");
        return;
      }

      const { welcomeChannelId, welcomeRoleId } = guildConfig;
      const channel = member.guild.channels.cache.get(welcomeChannelId);
      const role = member.guild.roles.cache.get(welcomeRoleId);

      if (!channel) {
        console.error("Welcome channel not found in the server.");
        return;
      }

      if (role) {
        await member.roles.add(role).catch(console.error);
      } else {
        console.error("Role not found in the server.");
      }

      const embed = new EmbedBuilder()
        .setColor("#7289DA")
        .setTitle(`Welcome to our server, ${member.user.username}! 🎉`)
        .setDescription(
          "We're thrilled to have you with us. Please take a moment to read the server rules and enjoy your stay! 🥳"
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

      await channel.send({ embeds: [embed] });

      console.log(`Embed sent for guild ${member.guild.name}`);
    } catch (error) {
      console.error("Error in guildMemberAdd event:", error);
    }
  },
};