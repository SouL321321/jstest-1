const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs");

module.exports = (client) => {
  client.commandArray = client.commandArray || [];

  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync(`./src/commands`);
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);

        if (command.data && command.data.name) {
          commands.set(command.data.name, command);
          commandArray.push(command.data);
        } else {
          console.error(
            `Command in file ${file} is missing required properties.`
          );
        }
      }
    }

    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;
    const rest = new REST({ version: 10 }).setToken(process.env.TOKEN);
    try {
      console.log("Started refreshing application (/) commands.");

      await rest
        .put(Routes.applicationGuildCommands(clientId, guildId), {
          body: client.commandArray,
        })
        .then(() =>
          console.log("Successfully reloaded application (/) commands.")
        )
        .catch((error) => {
          console.error(`Error reloading commands: ${error.message}`);
        });
    } catch (error) {
      console.error(error);
    }
  };
};
