// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const puppeteer = require("puppeteer");

// module.exports = {
//     data: new SlashCommandBuilder()
//     .setName("chatgpt")
//     .setDescription("Ask to Chat GPT!")
//     .addStringOption(option => option.setName("prompt").setDescription("The prompt for the AI").setRequired(true)),
//     async execute (interaction) {

//         await interaction.reply ({ content: `🧠Loading your response... this could take some time`, ephemeral: true });

//         const { options } = interaction;
//         const prompt = options.getString("prompt");

//         const browser = await puppeteer.launch({ headless: true });
//         const page = await browser.newPage();
//     }
// }