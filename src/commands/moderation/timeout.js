const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
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

    let timeOutRole = interaction.guild.roles.cache.find(
      (role) => role.name === "Time-Out"
    );
    if (!timeOutRole) {
      try {
        timeOutRole = await interaction.guild.roles.create({
          name: "Time-Out",
          color: "#808080",
          permissions: [],
        });
      } catch (error) {
        console.error("Error creating Time-Out role:", error);
        return interaction.reply({
          content: "An error occurred while creating Time-Out role.",
          ephemeral: true,
        });
      }
    }

    try {
      await member.roles.add(timeOutRole);
      // Aggiungi il membro al timeoutMember
      const timeoutMember = new TimeoutMember({
        guildId: interaction.guildId,
        memberId: member.id,
        timeoutEnd: new Date(Date.now() + duration * 1000),
      });
      await timeoutMember.save();

      interaction.reply({
        content: `${
          member.displayName
        } has been put in time-out for ${formatDuration(
          duration
        )} with reason: ${reason || "No reason provided"}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error putting member in time-out:", error);
      interaction.reply({
        content: "An error occurred while putting member in time-out.",
        ephemeral: true,
      });
    }

    setTimeout(async () => {
      try {
        if (member.roles.cache.has(timeOutRole.id)) {
          await member.roles.remove(timeOutRole);

          await TimeoutMember.deleteOne({
            guildId: interaction.guildId,
            memberId: member.id,
          });

          interaction.followUp({
            content: `${member.displayName} has been released from time-out.`,
          });
        }
      } catch (error) {
        console.error("Error releasing member from time-out:", error);
        interaction.followUp({
          content: "An error occurred while releasing member from time-out.",
        });
      }
    }, duration * 1000);
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
