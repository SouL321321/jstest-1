const { REST } = require("@discordjs/rest");
const { Routes, Collection } = require("discord.js");
const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync(`./src/commands`);
    client.commands = new Collection();
    client.commandArray = [];

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);

        if (command.data && command.data.name) {
          client.commands.set(command.data.name, command);
          client.commandArray.push(command.data);
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

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: client.commandArray,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(`Error reloading commands: ${error.message}`);
    }
  };
};
