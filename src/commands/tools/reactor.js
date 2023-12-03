const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactor")
    .setDescription("Return reactions!"),
  async execute(interaction, client) {
    const message = await interaction.reply({
      content: `React here!`,
      fetchReply: true
    });

    const filter = (user) => {
      return user.id == interaction.user.id;
    };

    message
      .awaitReactions({ filter, max: 3, time: 10000, errors: ["time ended"] })
      .then((collected) => console.log(collected.size))
      .catch((collected) => {
        console.log(
          `After a ten seconds, only ${collected.size} out of 3 reacted.`
        );
      });
  },
};
