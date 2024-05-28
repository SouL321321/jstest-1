const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const buttonPagination = require("../../events/client/buttonPagination");
const footerData = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List of commands 📔"),

  async execute (interaction, client) {
    try {
      const commandFolders = fs.readdirSync("./src/commands");
      const helpEmbeds = [];

      for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(".js"));

        const categoryEmbed = new EmbedBuilder()
          .setTitle(folder)
          .setFooter({ text: footerData.footerText })
          .setTimestamp()
          .setThumbnail(client.user.displayAvatarURL());

        const subcommands = [];

        for (const file of commandFiles) {
          const command = require(`../${folder}/${file}`);

          if (command.deleted) {
            continue;
          }

          const description = `${command.data.description || "No description provided."}`;

          if (command.data.type === "SUB_COMMAND" || command.data.type === "SUB_COMMAND_GROUP") {
            subcommands.push(command);
          } else {
            categoryEmbed.addFields({
              name: `/${command.data.name}`,
              value: description,
            });
          }
        }

        if (subcommands.length > 0) {
          categoryEmbed.addFields({
            name: "Subcommands",
            value: subcommands.map(subcommand => `/${subcommand.data.name}`).join("\n"),
          });
        }

        helpEmbeds.push(categoryEmbed);
      }

      await buttonPagination(interaction, helpEmbeds);
    } catch (err) {
      console.log(err);
    }
  },
};
