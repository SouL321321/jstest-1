// const { PermissionsBitField } = require("discord.js");

// module.exports = {
//   customId: "lockTicketBtn",
//   userPermissions: [PermissionsBitField.Flags.ManageThreads],
//   botPermissions: [],
//   async execute(interaction, client) {
//     try {
//       const { channel } = interaction;
//       await interaction.deferReply({
//         ephemeral: true,
//       });

//       await channel.setLocked(true);

//       return await interaction.editReply({
//         content: "This ticket has been locked.",
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   },
// };
