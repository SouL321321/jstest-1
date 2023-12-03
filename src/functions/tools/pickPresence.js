const { ActivityType } = require("discord.js");

module.exports = (client) => {
  client.pickPresence = async () => {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      const activity = {
        name: `⌚Time: ${formattedTime}⌚`,
        type: ActivityType.DEFAULT,
      };
      client.user.setActivity(activity);
  };
};
