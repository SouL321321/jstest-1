// const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
// const ticketSchema = require("../../models/ticketSchema");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("ticket-add-member")
//     .setDescription("Add a member to a ticket.")
//     .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageThreads)
//     .addUserOption((option) =>
//       option
//         .setName("member")
//         .setDescription("The member to add the ticket.")
//         .setRequired(true)
//     ),
//   userPermissions: [PermissionsBitField.Flags.ManageThreads],
//   botPermissions: [],
//   async execute(interaction, client) {
//     try {
//       const { channel, options, guild } = interaction;
//       await interaction.deferReply();

//       const memberToAdd = options.getUser("member");

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
//         (mbr) => mbr.id === memberToAdd.id
//       );
//       if (!memberExistsInServer) {
//         return await interaction.editReply({
//           content: "The member you specified is not in the server.",
//         });
//       }

//       const threadMember = await channel.members
//         .fetch(memberToAdd.id)
//         .catch((err) => {
//           console.log(err);
//         });

//       if (threadMember) {
//         return await interaction.editReply({
//           content: "The member you specified is already in the ticket.",
//         });
//       }

//       ticket.membersAdded.push(memberToAdd.id);
//       ticket.save();

//       await channel.members.add(memberToAdd.id);

//       return await interaction.editReply({
//         content: `Successfully added ${memberToAdd} to the ticket.`,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   },
// };
