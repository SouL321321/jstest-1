// const {
//   PermissionsBitField,
//   EmbedBuilder,
//   ButtonStyle,
//   ButtonBuilder,
//   ActionRowBuilder,
// } = require("discord.js");

// module.exports = {
//   customId: "closeTicketBtn",
//   userPermissions: [PermissionsBitField.Flags.ManageThreads],
//   botPermissions: [],
//   async execute(interaction, client) {
//     try {
//       await interaction.deferReply();

//       const confirmCloseTicketEmbed = new EmbedBuilder()
//         .setColor("DarkRed")
//         .setTitle("Close Ticket")
//         .setDescription("Are you sure to close this ticket?");

//       const confirmCloseTicketBtns = new ActionRowBuilder().setComponents([
//         new ButtonBuilder()
//           .setCustomId("confirmCloseTicketBtn")
//           .setLabel("Confirm")
//           .setStyle(ButtonStyle.Danger),
//         new ButtonBuilder()
//           .setCustomId("cancelCloseTicketBtn")
//           .setLabe("Cancel")
//           .setStyle(ButtonStyle.Success),
//         new ButtonBuilder()
//           .setCustomId(feedbackTicketBtn)
//           .setLabel("Give Feedback")
//           .setStyle(ButtonStyle.Secondary),
//       ]);

//       return await interaction.editReply({
//         embeds: [confirmCloseTicketEmbed],
//         components: [confirmCloseTicketBtns],
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   },
// };
