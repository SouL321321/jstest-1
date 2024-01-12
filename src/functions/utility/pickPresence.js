const { ActivityType } = require("discord.js");

module.exports = (client) => {
  client.pickPresence = async () => {
    const options = [
      {
        type: ActivityType.Watching,
        text: "Im stalking u👀",
        status: "dnd",
      },
      // {
      //   type: ActivityType.Streaming,
      //   text: "in afk-zone (random stuff)🥮",
      //   status: "idle",
      // },
      // {
      //   type: ActivityType.Listening,
      //   text: "Do not disturb me🛑 ty",
      //   status: "dnd",
      // },
    ];

    const option = Math.floor(Math.random() * options.length);

    client.user.setPresence({
      activities: [
        {
          name: options[option].text,
          type: options[option].type,
        }],
      status: options[option].status,
    });
  };
};
