const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
  } = require("discord.js");
  
  module.exports = async (interaction, pages, time = 30 * 1000) => {
    try {
      if (!interaction || !Array.isArray(pages) || pages.length === 0) {
        throw new Error("Invalid argument");
      }
  
      await interaction.deferReply();
  
      if (pages.length === 1) {
        return await interaction.editReply({
          embeds: pages,
          components: [],
          fetchReply: true,
        });
      }
  
      let index = 0;
  
      const prev = new ButtonBuilder()
        .setCustomId("prev")
        .setEmoji("⬅️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);
  
      const home = new ButtonBuilder()
        .setCustomId("home")
        .setEmoji("🏠")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);
  
      const next = new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("➡️")
        .setStyle(ButtonStyle.Primary);
  
      const buttons = new ActionRowBuilder().addComponents(prev, home, next);
  
      const msg = await interaction.editReply({
        embeds: [pages[index]],
        components: [buttons],
        fetchReply: true,
      });
  
      const filter = (i) => i.user.id === interaction.user.id;
      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time,
      });
  
      collector.on("collect", async (i) => {
        if (i.customId === "prev" && index > 0) {
          index--;
        } else if (i.customId === "home") {
          index = 0;
        } else if (i.customId === "next" && index < pages.length - 1) {
          index++;
        }
  
        prev.setDisabled(index === 0);
        home.setDisabled(index === 0);
        next.setDisabled(index === pages.length - 1);
  
        await i.update({
          embeds: [pages[index]],
          components: [buttons],
        });
  
        collector.resetTimer();
      });
  
      collector.on("end", async () => {
        await msg.edit({
          components: [],
        });
      });
  
      return msg;
    } catch (err) {
      console.log(err);
    }
  };
  