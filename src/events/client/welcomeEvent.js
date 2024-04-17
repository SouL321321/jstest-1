const { EmbedBuilder } = require("discord.js");
const WelcomeEv = require("../../models/WelcomeEv");

module.exports = {
  async execute(guild, client) {
    try {
      const filter = { guildId: guild.id };
      const update = {
        guildId: guild.id,
        name: guild.name,
      };

      await WelcomeEv.findOneAndUpdate(filter, update, {
        upsert: true,
        new: true,
      });

      const embed = new EmbedBuilder()
        .setTitle(
          "Thank you for adding " +
            client.user.username +
            " to " +
            guild.name +
            "!"
        )
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
          }
        )
        .setFooter({ text: "Need help? Reach out to us anytime!" });

      const systemChannel = guild.systemChannel;
      if (systemChannel) {
        systemChannel.send({ embeds: [embed] }).catch(console.error);
      } else {
        console.log("Unable to find the system channel.");
      }
    } catch (error) {
      console.error("Error adding server to database:", error);
    }
  },
};
