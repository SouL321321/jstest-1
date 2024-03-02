const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const wiki = require("wikijs").default();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search-wiki")
    .setDescription("Ask Wikipedia!🌍")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Search on Wikipedia")
        .setRequired(true)
    ),
    async execute (interaction) {
    const query = interaction.options.getString("query");

    await interaction.deferReply();

    const search = await wiki.search(query);
    if (!search.results.length)
      return await interaction.editReply({
        content: `Wikipedia doesn't know what you're talking about...`,
        ephemeral: true,
      });

    const result = await wiki.page(search.results[0]);

    const summary = await result.summary();
    const maxWords = 100; 

    const limitedSummary = summary.split(" ").slice(0, maxWords).join(" ");

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Wiki Search: ${result.raw.title}`)
      .setDescription(`\`\`\`${limitedSummary}\`\`\``);

    if (summary.length > limitedSummary.length) {
      embed.addFields({
        name: "READ MORE",
        value: `[Wikipedia Article](${result.raw.fullurl})`,
      });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
