require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const welcomeEvent = require("./events/client/guildMemberAdd");
const fs = require("fs");
const mongoose = require("mongoose");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageTyping,
    IntentsBitField.Flags.GuildIntegrations,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.AutoModerationExecution,
    IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.AutoModerationConfiguration,
  ],
  debug: true,
});

mongoose.connect(process.env.DATABASE, {
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to the database!");
});

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles) {
    require(`./functions/${folder}/${file}`)(client);
  }
}

client.handleEvents();
client.handleComponents();
client.handleCommands();

client.login(process.env.TOKEN);
client.on("guildMemberAdd", (member) => {
  try {
    welcomeEvent.execute(member);
  } catch (error) {
    console.error("Error in guildMemberAdd event:", error);
  }
});
client.on(welcomeEvent.name, (...args) => welcomeEvent.execute(...args));
