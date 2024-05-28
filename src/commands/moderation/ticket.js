const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const Feedback = require("../../models/FeedbackSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("feedback")
    .setDescription("Manage the feedback system.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Setup the feedback system.")
        .addChannelOption((option) =>
          option
            .setName("feedback-channel")
            .setDescription("The channel for Feedbacks.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable the feedback system.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("send")
        .setDescription(`Give some feedback to the server staff's!`)
        .addStringOption((option) =>
          option
            .setName("feedback")
            .setDescription("Write your feedback.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("star")
            .setDescription("Rate the feedback with stars.")
            .setRequired(true)
            .addChoices(
              { name: "⭐", value: "⭐" },
              { name: "⭐⭐", value: "⭐⭐" },
              { name: "⭐⭐⭐", value: "⭐⭐⭐" },
              { name: "⭐⭐⭐⭐", value: "⭐⭐⭐⭐" },
              { name: "⭐⭐⭐⭐⭐", value: "⭐⭐⭐⭐⭐" }
            )
        )
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  async execute(interaction, client) {
    const data = await Feedback.findOne({ Guild: interaction.guild.id });

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "setup":
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.Administrator
          )
        ) {
          const errEmbed = new EmbedBuilder()
            .setDescription(`You do not have permissions to use this command`)
            .setColor("#020202");

          return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }

        if (data) {
          const alreadyEmbed = new EmbedBuilder()
            .setColor(`#020202`)
            .setDescription(
              `Looks like you already have the feedback system set!`
            );
          return await interaction.reply({
            embeds: [alreadyEmbed],
            ephemeral: true,
          });
        } else {
          const FeedbackChannel =
            interaction.options.getChannel("feedback-channel");
          const newData = await Feedback.create({
            Guild: interaction.guild.id,
            FeedbackChannel: FeedbackChannel.id,
          });
          newData.save();

          const feedbackSetup = new EmbedBuilder()
            .setColor("#020202")
            .setDescription(
              `Feedback system has now been configured. To disable, run \`feedback disable\`!`
            )
            .addFields({
              name: "Feedback Channel",
              value: `${FeedbackChannel}`,
            });

          return await interaction.reply({
            embeds: [feedbackSetup],
            ephemeral: true,
          });
        }
        break;
      case "disable":
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.Administrator
          )
        ) {
          const errEmbed1 = new EmbedBuilder()
            .setDescription(`You do not have permissions to use this command`)
            .setColor("#020202");

          return interaction.reply({ embeds: [errEmbed1], ephemeral: true });
        }

        if (!data) {
          const alredy = new EmbedBuilder()
            .setColor(`#020202`)
            .setDescription(
              `Looks like you don't already have a feedback system set up!`
            );
          return interaction.reply({ embeds: [alredy], ephemeral: true });
        } else {
          await Feedback.deleteOne({ Guild: interaction.guild.id });
          const deleted = new EmbedBuilder()
            .setColor(`#020202`)
            .setDescription(`I have deleted your feedback channel!`);
          return interaction.reply({ embeds: [deleted], ephemeral: true });
        }
        break;

      case "send":
        if (!data) {
          const notset = new EmbedBuilder()
            .setColor(`#020202`)
            .setDescription(
              `The feedback system is not set up here, use \`feedback setup\` to setup it!`
            );
          return await interaction.reply({ embeds: [notset], ephemeral: true });
        }

        const star = interaction.options.getString("star");
        const feedback = interaction.options.getString("feedback");
        const feedbackChannel = interaction.client.channels.cache.get(
          data.FeedbackChannel
        );

        const embed = new EmbedBuilder()
          .setColor("#020202")
          .setTitle("**New Feedback!**")
          .setDescription(`${interaction.user} sent some feedback!`)
          .addFields({ name: "**Description:**", value: `${feedback}` })
          .addFields({ name: "**Stars**", value: `${star}` });

        const embed1 = new EmbedBuilder()
          .setColor("#020202")
          .setDescription(
            `Your feedback successfully sent in ${feedbackChannel}!`
          );

        feedbackChannel.send({ embeds: [embed] });
        await interaction.reply({ embeds: [embed1], ephemeral: true });
        break;
      default:
        break;
    }
  },
};
