const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Get a random trivia question"),

  async execute(interaction) {
    try {
      const fetch = await import("node-fetch");
      const response = await fetch.default(
        "https://opentdb.com/api.php?amount=1&type=multiple"
      );
      const data = await response.json();

      const [question] = data.results;
      const answers = [...question.incorrect_answers, question.correct_answer];
      answers.sort(() => Math.random() - 0.5);

      await interaction.reply({
        content: `**Category:** ${question.category}\n**Question:** ${
          question.question
        }\n\n${answers
          .map((answer, index) => `${index + 1}. ${answer}`)
          .join("\n")}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error fetching trivia:", error);
      await interaction.reply({
        content: "An error occurred while fetching trivia questions.",
        ephemeral: true,
      });
    }
  },
};
