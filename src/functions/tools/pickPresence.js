const { ActivityType } = require("discord.js");

module.exports = (client) => {
  client.pickPresence = async () => {
    const options = [
      {
        type: ActivityType.Watching,
        text: "in overthinking🗯",
        status: "dnd",
      },
      {
        type: ActivityType.Streaming,
        text: "in overthinking🗯",
        status: "idle",
      },
      {
        type: ActivityType.Listening,
        text: "in overthinking🗯",
        status: "dnd",
      },
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
