// CREDITS: un7!7l3d (851452256217464892)

const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot")
    .setDescription("Get bot info or bot stats")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("Get information about the bot.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("stats").setDescription("Get the bot status")
    )
    .toJSON(),

  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "info") {
      const { guild } = interaction;
      await interaction.deferReply();
      try {
        // Get Discord.js version
        const discordJsVersion = require("discord.js").version;

        // Get Node.js version
        const nodeJsVersion = process.version;

        // Get MongoDB version
        const mongoDbVersion = mongoose.version;
        const activeCommands = interaction.client.commands;

        // Get the number of active commands
        const activeCommandCount = activeCommands.size;
        const embed = new EmbedBuilder() // Constructs a new embed
          .setAuthor({
            name: "Bot Info",
            iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          })
          .addFields(
            {
              name: `\`🤖\`** | DJS Version:**`,
              value: `> [*${discordJsVersion}*](https://discord.js.org/docs/packages/discord.js/14.14.1)`,
              inline: true,
            },
            {
              name: `\`🚀\`** | NodeJs Version:**`,
              value: `> [*${nodeJsVersion}*](https://nodejs.org/dist/latest-v20.x/docs/api/)`,
              inline: true,
            },
            {
              name: `\`🗄️\`** | Database Version:**`,
              value: `> [*${mongoDbVersion}*](https://docs.mongodb.com/drivers/node/)`,
              inline: true,
            },
            {
              name: `\`🧑‍💻\`** | Developer:**`,
              value: `> \`un7!7l3d\``,
              inline: true,
            },
            {
              name: `\`🗓️\`** | Created:**`,
              value: `> \`14/02/2024\``,
              inline: true,
            },
            {
              name: `\`⚙️\`** | Active Commands:**`,
              value: `> \`${activeCommandCount}\``,
              inline: true,
            }
          )
          .setColor("Fuchsia") // Set's the embed color
          .setTimestamp() // Set's the embed timestamp
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: `${interaction.user.displayAvatarURL({
              dynamic: true,
            })}`,
          }); // Set's the embed footer

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.log(`An error occured in the bot-info command:\n\n${error}`);
      }
    }
    if (subcommand === "stats") {
      try {
        const startTime = Date.now(); // Gets the current timestamp to calculate REST latency

        const placeEmbed = new EmbedBuilder() // Creates a placeholder embed to notify the user
          .setTitle("Fetching...") // Set's the embed title
          .setColor("DarkPurple"); // Set's the embed color

        await interaction.reply({ embeds: [placeEmbed] }); // Sends a placeholder embed as a reply to the interaction

        const latency = await client.ws.ping; // Websocket latency
        const restLatency = Date.now() - startTime; // REST latency
        const uptime = new Date(Date.now() - client.uptime); // Calculate uptime of the bot

        // Function to format bytes into a human-readable format with decimal points
        function formatBytes(bytes) {
          const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
          if (bytes === 0) return "0 Byte";
          const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
          const result = (bytes / Math.pow(1024, i)).toFixed(2);

          if (isNaN(result)) {
            console.log("Error: Result is NaN. Bytes:", bytes);
            return "Error";
          }

          return result + " " + sizes[i];
        }

        // Function to get the size of a directory recursively
        async function getDirectorySize(path) {
          // Recursive function to calculate the total size of a directory
          const calculateSize = async (currentPath) => {
            let totalSize = 0; // Initialize totalSize for each directory
            const files = fs.readdirSync(currentPath);

            for (const file of files) {
              const filePath = `${currentPath}/${file}`;
              const stats = fs.statSync(filePath);

              if (stats.isDirectory()) {
                totalSize += await calculateSize(filePath);
              } else {
                totalSize += stats.size;
              }
            }

            return totalSize;
          };

          return await calculateSize(path);
        }

        const projectDirectoryPath = "C:\\Users\\Dottore\\Desktop\\jstest-1"; // Specify the path to your project directory
        const projectSize = await getDirectorySize(projectDirectoryPath); // Get the size of the project directory

        const embed = new EmbedBuilder() // Constructs a new embed
          .setAuthor({
            name: "Bot Status",
            iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          })
          .addFields(
            {
              name: `\`🔌\`** | WebSocket:**`,
              value: `> *\`${latency} m/s\`*`,
              inline: true,
            },
            {
              name: `\`🌍\`** | REST:**`,
              value: `> *\`${restLatency} m/s\`*`,
              inline: true,
            },
            {
              name: `\`📈\`** | UpTime:**`,
              value: `> ${time(uptime, "R")}`,
              inline: true,
            },
            {
              name: `\`💻\`** | CPU:**`,
              value: `> *\`${(process.cpuUsage().system / 1024 / 1024).toFixed(
                2
              )}%\`*`,
              inline: true,
            },
            {
              name: `\`💽\`** | RAM:**`,
              value: `> *\`${(
                process.memoryUsage().heapUsed /
                1024 /
                1024
              ).toFixed(2)}MB\`*`,
              inline: true,
            },
            {
              name: `\`🗃️\`** | Storage:**`,
              value: `> *\`${formatBytes(projectSize)}\`*`,
              inline: true,
            }
          )
          .setColor("DarkPurple") // Set's the embed color
          .setTimestamp() // Set's the embed timestamp
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
          }); // Set's the embed footer

        await interaction.editReply({ embeds: [embed] }); // Sends the main embed with websocket and REST latencies as a reply to the interaction
      } catch (error) {
        console.log(`An error occured in the bot-status command:\n\n${error}`); // Catches any error's and log's it
      }
    }
  },
};
