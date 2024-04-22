const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  countdown: true,
  data: new SlashCommandBuilder()
    .setName("time-view")
    .setDescription("View the time and date for a specific timezone.")
    .addStringOption((option) =>
      option
        .setName("timezone")
        .setDescription("Select the timezone.")
        .setRequired(true)
        .addChoices(
          { name: "Central European Time (CET)", value: "Europe/Paris" },
          { name: "Greenwich Mean Time (GMT)", value: "GMT" },
          { name: "Coordinated Universal Time (UTC)", value: "UTC" },
          { name: "Eastern Standard Time (EST)", value: "America/New_York" },
          { name: "Pacific Standard Time (PST)", value: "America/Los_Angeles" },
          {
            name: "Australian Eastern Standard Time (AEST)",
            value: "Australia/Sydney",
          },
          { name: "Japan Standard Time (JST)", value: "Asia/Tokyo" },
          { name: "Indian Standard Time (IST)", value: "Asia/Kolkata" },
          { name: "Central Standard Time (CST)", value: "America/Chicago" },
          { name: "British Summer Time (BST)", value: "Europe/London" },
          { name: "Eastern European Time (EET)", value: "Europe/Bucharest" },
          { name: "Mountain Standard Time (MST)", value: "America/Denver" },
          {
            name: "Central European Summer Time (CEST)",
            value: "Europe/Amsterdam",
          },
          { name: "Eastern European Time (EET)", value: "Europe/Helsinki" },
          { name: "Alaska Standard Time (AKST)", value: "America/Anchorage" },
          {
            name: "Hawaii-Aleutian Standard Time (HAST)",
            value: "Pacific/Honolulu",
          },
          { name: "Mountain Standard Time (MST)", value: "America/Phoenix" },
          { name: "Central Daylight Time (CDT)", value: "America/Mexico_City" },
          { name: "Eastern Daylight Time (EDT)", value: "America/Toronto" },
          {
            name: "Australian Central Standard Time (ACST)",
            value: "Australia/Adelaide",
          },
          {
            name: "New Zealand Standard Time (NZST)",
            value: "Pacific/Auckland",
          },
          { name: "Atlantic Daylight Time (ADT)", value: "America/Halifax" }
        )
    ),
  async execute(interaction, client) {
    const timezone = interaction.options.getString("timezone");

    let actualDateTime;
    try {
      actualDateTime = new Date().toLocaleString("en-US", {
        timeZone: timezone,
      });
    } catch (error) {
      console.error("Error getting time for timezone:", error);
      actualDateTime = "Invalid timezone.";
    }

    const embed = new EmbedBuilder()
      .setTitle(`Time and date in ${timezone}`)
      .setDescription(`\`\`\`${actualDateTime}\`\`\``)
      .setColor("#7289DA")
      .setFooter({
        text: `Provided by ${client.user.username}`,
        iconURL: client.user.displayAvatarURL(),
      });

    interaction.reply({ embeds: [embed] });
  },
};
