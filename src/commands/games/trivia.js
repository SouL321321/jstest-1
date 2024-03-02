const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const axios = require("axios");

// Map to keep track of users who have already answered today
const answeredToday = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Get a random trivia question"),

  async execute(interaction) {
    // Check if the user has already answered today
    if (answeredToday.has(interaction.user.id)) {
      await interaction.reply(
        "You've already answered the question today. Try again tomorrow!"
      );
      return;
    }

    try {
      const response = await axios.get("https://opentdb.com/api.php", {
        params: {
          amount: 1,
          category: 9,
          difficulty: "medium",
          type: "multiple",
        },
      });

      const { data } = response;
      if (!data.results || data.results.length === 0) {
        throw new Error("No trivia questions found in the response.");
      }

      const [question] = data.results;
      const answers = [...question.incorrect_answers, question.correct_answer];
      answers.sort(() => Math.random() - 0.5);

      // Create an array of option objects for the select menu
      const options = answers.map((answer, index) => ({
        label: `${index + 1}. ${answer}`,
        value: answer,
      }));

      // Create the select menu component
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("trivia_answer")
        .setPlaceholder("Select your answer...")
        .addOptions(options);

      // Create an action row to hold the select menu
      const actionRow = new ActionRowBuilder().addComponents(selectMenu);

      await interaction.reply({
        content: `**Category:** ${question.category}\n**Question:** ${question.question}`,
        components: [actionRow],
      });

      // Add the user to the list of users who have already answered today
      answeredToday.set(interaction.user.id, true);
    } catch (error) {
      console.error("Error fetching trivia question:", error);
      await interaction.reply(
        "An error occurred while fetching the trivia question."
      );
    }
  },

  async handleInteraction(interaction) {
    try {
      if (
        !interaction.isStringSelectMenu() ||
        interaction.customId !== "trivia_answer"
      )
        return;

      const selectedAnswer = interaction.values[0]; // Get the selected value from the select menu
      const message = await interaction.channel.messages.fetch(
        interaction.message.id
      ); // Fetch the message details
      const correctAnswer = message.components[0].components[0].options.find(
        (option) => option.value === selectedAnswer
      );

      if (!correctAnswer) {
        await interaction.reply("Invalid selection.");
        return;
      }

      if (selectedAnswer === correctAnswer.value) {
        await interaction.reply("Congratulations! Your answer is correct.");
      } else {
        await interaction.reply(
          `Sorry, the correct answer is: ${correctAnswer.label}`
        );
      }
    } catch (error) {
      console.error("Error handling interaction:", error);
      await interaction.reply(
        "An error occurred while handling the interaction."
      );
    }
  },
};
