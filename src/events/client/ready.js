const { PresenceUpdateStatus } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    setTimeout(client.pickPresence, 6000);
    console.log(`Ready! 🍀 ${client.user.tag} is logged nd online!✅`);
  },
};

