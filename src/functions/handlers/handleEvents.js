const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
  client.handleEvents = async () => {
    const eventFolders = fs.readdirSync(`./src/events`);
    for (const folder of eventFolders) {
      const eventFiles = fs
        .readdirSync(`./src/events/${folder}/`)
        .filter((file) => file.endsWith(".js"));

      for (const file of eventFiles) {
        const event = require(`../../events/${folder}/${file}`);
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
      }
    }

    client.on("guildCreate", (guild) => {
      const embed = new EmbedBuilder()
        .setTitle("Thank you for adding " + client.user.username + "!")
        .setDescription(
          "I'm here to help manage your server and add some fun! Here are a few things you can do with me."
        )
        .setColor(0x1a75ff)
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
          {
            name: "🚀 Get Started",
            value: "Type `/help` to see all my commands.",
            inline: false,
          },
          {
            name: "🎮 Mini-Games",
            value: "Enjoy interactive mini-games right within browser.",
            inline: false,
          },
          {
            name: "🔧 Tools",
            value:
              "Use tools like weather, studytimer, wikipedia, earthquake and more to boost your server's productivity.",
            inline: false,
          },
          {
            name: "📈 ?",
            value: "SOME IDEA SOON.",
            inline: false,
          }
        )
        .setFooter({ text: "Need help? Reach out to us anytime!" });

      const systemChannel = guild.systemChannel;
      if (systemChannel) {
        systemChannel.send({ embeds: [embed] }).catch(console.error);
      } else {
        console.log("Unable to find the system channel.");
      }
    });
  };
};
