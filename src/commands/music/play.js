const { EmbedBuilder } = require("discord.js");
const SpotifyWebApi = require("spotify-web-api-node");
const { Player } = require("discord-player");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT,
  clientSecret: process.env.SECRET_CLIENT,
});

module.exports = {
  data: {
    name: "play",
    description: "Play a song from Spotify using a Spotify track URL",
    options: [
      {
        name: "track_url",
        type: 3,
        description: "The Spotify track URL",
        required: true,
      },
    ],
  },
  async execute(interaction) {
    try {
      const data = await spotifyApi.clientCredentialsGrant();
      const accessToken = data.body.access_token;

      spotifyApi.setAccessToken(accessToken);

      const trackUrl = interaction.options.getString("track_url");

      if (!trackUrl.startsWith("https://open.spotify.com/track/")) {
        return await interaction.reply(
          "Invalid Spotify track URL. Please provide a valid Spotify track URL."
        );
      }

      const member = interaction.guild.members.cache.get(interaction.user.id);
      const voiceChannel = member.voice.channel;
      if (!voiceChannel) {
        return await interaction.reply(
          "You need to be in a voice channel to use this command."
        );
      }

      const player = new Player(interaction.client);
      const result = await player.play(voiceChannel, trackUrl);
      if (!result) {
        return await interaction.reply("Unable to play the track.");
      }

      const trackId = trackUrl.split("/").pop();

      const embed = new EmbedBuilder()
        .setTitle(`Play Track`)
        .setDescription(`[Click here to listen](${trackUrl})`)
        .addField("Track ID", trackId)
        .setColor("#1ED760");

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error playing track:", error);
      await interaction.reply(
        "An error occurred while playing the track."
      );
    }
  },
};
