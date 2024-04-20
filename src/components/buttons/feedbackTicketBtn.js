// const {
//   ModalBuilder,
//   ActionRowBuilder,
//   TextInputBuilder,
//   TextInputStyle,
// } = require("discord.js");

// module.exports = {
//   customId: "feedbackTicketBtn",
//   userPermissions: [],
//   botPermissions: [],
//   async execute(interaction, client) {
//     try {
//       const feedbackModal = new ModalBuilder()
//         .setTitle("Feedback on Ticket")
//         .setCustomId("feedbackTicketMdl")
//         .setComponents(
//           new ActionRowBuilder().setComponents(
//             new TextInputBuilder()
//               .setLabel("Rating")
//               .setCustomId("ratingTicketMsg")
//               .setPlaceholder("Enter a rating between 1 - 5")
//               .setStyle(TextInputStyle.Short)
//           ),
//           new ActionRowBuilder().setComponents(
//             new TextInputBuilder()
//               .setLabel("Feedback")
//               .setCustomId("feedbackTicketMsg")
//               .setPlaceholder("Enter feedback for the ticket")
//               .setStyle(TextInputStyle.Paragraph)
//           )
//         );

//       return interaction.showModal(feedbackModal);
//     } catch (err) {
//       console.log(err);
//     }
//   },
// };
