const { SlashCommandBuilder, ActivityType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("time")
    .setDescription("Return the time!⌚"),
  async execute(interaction, client) {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const activity = {
        name: `⌚Time: ${formattedTime}⌚`,
        type: ActivityType.DEFAULT,
    };
    client.user.setActivity(activity);
    
    const currentTime = new Date().toLocaleTimeString();
    interaction.reply(`Time: ${currentTime}`);
  },
};
