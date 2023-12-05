module.exports = {
  data: {
    name: `button-ban`,
  },
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") ?? "No reason provided";
  },
};
