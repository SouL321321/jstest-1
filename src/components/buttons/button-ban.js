module.exports = {
  data: {
    name: `button-ban`,
  },
  async execute(interaction) {
    // const target = interaction.options.getUser("target");
    // const reason =
    //   interaction.options.getString("reason") ?? "No reason provided";
    content: `Are you sure you want to ban ${target} for reason: ${reason}?`
  },
};
