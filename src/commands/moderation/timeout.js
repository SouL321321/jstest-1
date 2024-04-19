const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const TimeoutMember = require("../../models/TimeoutMember");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Put a member in time-out for a specified duration.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to put in time-out.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("Select the duration of the time-out.")
        .addChoices(
          { name: "60 secs", value: "60" },
          { name: "5 mins", value: "300" },
          { name: "10 mins", value: "600" },
          { name: "1 hr", value: "3600" },
          { name: "1 day", value: "86400" },
          { name: "1 week", value: "604800" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Optional reason for the time-out.")
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("member");
    const durationChoice = interaction.options.getString("duration");
    const duration = parseInt(durationChoice);
    const reason = interaction.options.getString("reason");

    if (
      member.user.bot ||
      member.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      return interaction.reply({
        content: "You cannot timeout administrators or bots.",
        ephemeral: true,
      });
    }

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply({
        content: "You don't have permission to put members in time-out.",
        ephemeral: true,
      });
    }

    if (isNaN(duration) || duration <= 0) {
      return interaction.reply({
        content: "Please specify a valid duration.",
        ephemeral: true,
      });
    }

    try {
      await member.timeout(duration * 1000);

      const timeoutEnd = new Date(Date.now() + duration * 1000);
      const newTimeoutMember = new TimeoutMember({
        guildId: interaction.guildId,
        memberId: member.id,
        timeoutEnd: timeoutEnd,
      });
      await newTimeoutMember.save();

      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Member Time-Out")
        .setDescription(
          `${member.displayName} has been put in time-out for ${formatDuration(
            duration
          )} with reason: ${reason || "No reason provided"}  ||Stop Please||`
        )
        .setImage("https://as2.ftcdn.net/v2/jpg/01/85/73/43/1000_F_185734349_eVerlX4SvMyadhmxjmq0s6kMuo2mRozw.jpg")
        .setFooter({
          text: `Server: ${interaction.guild.name}`,
          iconURL: interaction.guild.iconURL(),
        })
        .toJSON();

      interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (error) {
      console.error("Error putting member in time-out:", error);
      interaction.reply({
        content: "An error occurred while putting member in time-out.",
        ephemeral: true,
      });
    }
  },
};

function formatDuration(duration) {
  const seconds = duration % 60;
  const minutes = Math.floor(duration / 60) % 60;
  const hours = Math.floor(duration / 3600) % 24;
  const days = Math.floor(duration / 86400);

  return `${days ? days + " day(s) " : ""}${hours ? hours + " hour(s) " : ""}${
    minutes ? minutes + " minute(s) " : ""
  }${seconds ? seconds + " second(s)" : ""}`;
}
