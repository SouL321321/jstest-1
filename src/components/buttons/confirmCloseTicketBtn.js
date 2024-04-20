// const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

// const ticketSetupSchema = require("../../models/ticketSetupSchema");
// const ticketSchema = require("../../models/ticketSchema");

// module.exports = {
//   customId: "confirmCloseTicketBtn",
//   userPermissions: [PermissionFlagsBits.ManageThreads],
//   botPermissions: [],
//   async execute(interaction, client) {
//     try {
//       const { channel, guild } = interaction;

//       const closingEmbed = new EmbedBuilder()
//         .setColor("Red")
//         .setTitle("Closing Ticket")
//         .setDescription("Closing ticket...");

//       await channel.send({ embeds: [closingEmbed] });

//       await interaction.deferReply();

//       const closedEmbed = new EmbedBuilder()
//         .setColor("Red")
//         .setTitle("Ticket Closed")
//         .setDescription("This ticket has been closed.");

//       const setupTicket = await ticketSetupSchema.findOne({
//         guildID: guild.id,
//         ticketChannelId: channel.id,
//       });

//       const ticket = await ticketSchema.findOne({
//         guildID: guild.id,
//         ticketChannelID: channel.id,
//         closed: false,
//       });

//       const staffRole = guild.roles.cache.get(setupTicket.staffRoleID);
//       const hasRole = staffRole.members.has(ticket.ticketMemberID);
//       if (!hasRole) {
//         ticket.membersAdded.map(async (member) => {
//           await channel.members.remove(member);
//         });
//         await channel.members.remove(ticket.ticketMemberID);
//       }

//       await ticketSchema.findOneAndUpdate(
//         {
//           guildID: guild.id,
//           ticketChannelID: channel.id,
//           closed: false,
//         },
//         {
//           closed: true,
//         }
//       );

//       await channel.setArchived(true);

//       return await interaction.editReply({
//         embeds: [closedEmbed],
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   },
// };
