require("dotenv").config();
const { Client, IntentsBitField, Partials } = require("discord.js");
const { AutoPoster } = require("topgg-autoposter");
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
  partials: [Partials.Channel],
  debug: true,
});

mongoose.connect(process.env.DATABASE, {});

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

const ap = AutoPoster(process.env.TOPGG_TOKEN, client);

ap.on("posted", () => {
  console.log("Posted stats to Top.gg!");
});

client.on("messageCreate", async (message) => {
  if (message.guild) return;
  await client.channels.cache
    .get(process.env.CHANNEL_LOG)
    .send(
      ` **New DM Received** \n**By** - ${message.author} \n**Message** - ${message.content} `
    );
  return;
});

client.on("guildMemberAdd", (member) => {
  try {
    welcomeEvent.execute(member);
  } catch (error) {
    console.error("Error in guildMemberAdd event:", error);
  }
});

client.on(welcomeEvent.name, (...args) => welcomeEvent.execute(...args));

client.on("guildCreate", (guild) => {
  const welcomeEvent = require("./events/client/welcomeEvent");
  welcomeEvent.execute(guild, client);
});

client.login(process.env.TOKEN);
