// const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

// const ticketSchema = require("../../models/ticketSchema");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("ticket-remove-member")
//     .setDescription("Remove a member from a ticket.")
//     .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageThreads)
//     .addUserOption((option) =>
//       option
//         .setName("member")
//         .setDescription("The member to remove the ticket.")
//         .setRequired(true)
//     ),
//   userPermissions: [PermissionsBitField.Flags.ManageThreads],
//   botPermissions: [],

//   async execute(interaction, client) {
//     try {
//       const { channel, options, guild } = interaction;
//       await interaction.deferReply();

//       const memberToRemove = options.getUser("member");

//       const ticket = await ticketSchema.findOne({
//         guildID: guild.id,
//         ticketChannelID: channel.id,
//         closed: false,
//       });

//       if (!ticket) {
//         return await interaction.editReply({
//           content: "This channel is not a ticket channel.",
//         });
//       }

//       const memberExistsInServer = guild.members.cache.find(
//         (mbr) => mbr.id === memberToRemove.id
//       );
//       if (!memberExistsInServer) {
//         return await interaction.editReply({
//           content: "The member you specified is not in the server.",
//         });
//       }

//       const threadMember = await channel.members
//         .fetch(memberToRemove.id)
//         .catch((err) => {
//           console.log(err);
//         });

//       if (!threadMember) {
//         return await interaction.editReply({
//           content: "The member you specified isn't in the ticket.",
//         });
//       }

//       await ticketSchema.findOneAndUpdate(
//         {
//           guildID: guild.id,
//           ticketChannelID: channel.id,
//           closed: false,
//         },
//         {
//           $pull: {
//             membersAdded: memberToRemove.id,
//           },
//         }
//       );
//       ticket.save();

//       await channel.members.remove(memberToRemove.id);

//       return await interaction.editReply({
//         content: `Successfully removed ${memberToRemove} from the ticket.`,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   },
// };
