module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    setInterval(client.pickPresence, 10 * 1000);
    console.log(`Ready! 🍀 ${client.user.tag} is logged nd online!✅`);
  },
};
