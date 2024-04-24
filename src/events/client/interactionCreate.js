// CREDITS: Robotic (961958611364499456)

const { Interaction, EmbedBuilder } = require("discord.js");

//Create the Time-Data
const timeData = new Map();

//Create the User-Data
const userData = new Map();

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    /*/
    ADD: countdown:true,
    to your command code (like the image)
    /*/

    if (command.countdown === true) {
      if (userData.has(interaction.user.id)) {
        const futureTime = userData.get(interaction.user.id, timeData, true);

        const RemainingTime = futureTime + 12; //The remaining time was 10-12 seconds

        const timeEmbed = new EmbedBuilder()
          .setColor("DarkRed")
          .setTitle(`❗ | Countdown: <t:${RemainingTime}:R>`);

        //Send the Embed if the User have a Countdown
        return interaction.reply({
          embeds: [timeEmbed],
          ephemeral: true,
        });
      } else {
        //Create the Countdown-Data

        //The Timer-Data
        timeData.set(interaction.user.id, true);

        //The User-Data
        userData.set(interaction.user.id, Math.floor(Date.now() / 1000), true);

        //Delete the Data
        setTimeout(async () => {
          timeData.delete(timeData);
          userData.delete(interaction.user.id);
        }, 10000); //10 Seconds than  it will delete the data from the Map
      }
    }

    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      //Log if a error happenend in the Command
      console.error(error);
    }
  },
};
