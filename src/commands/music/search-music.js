const { EmbedBuilder } = require("discord.js");
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT,
  clientSecret: process.env.SECRET_CLIENT,
});

module.exports = {
  data: {
    name: "search-music",
    description: "Search a song from Spotify",
    options: [
      {
        name: "query",
        type: 3,
        description: "The name of the song to search on Spotify",
        required: true,
      },
    ],
  },
  async execute(interaction) {
    try {
      const data = await spotifyApi.clientCredentialsGrant();
      const accessToken = data.body.access_token;

      spotifyApi.setAccessToken(accessToken);

      const query = interaction.options.getString("query");

      const searchResults = await spotifyApi.searchTracks(query, { limit: 1 });

      const track = searchResults.body.tracks.items[0];
      const trackUrl = track.external_urls.spotify;

      const embed = new EmbedBuilder()
        .setTitle(`Play ${track.name}`)
        .setDescription(`[Click here to listen](${trackUrl})`)
        .setColor("#1ED760");

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error searching for the song on Spotify:", error);
      await interaction.reply(
        "An error occurred while searching for the song."
      );
    }
  },
};
