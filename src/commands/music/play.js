const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  joinVoiceChannel,
} = require("@discordjs/voice");
const SpotifyWebApi = require("spotify-web-api-node");

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Play,
  },
});

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT,
  clientSecret: process.env.SECRET_CLIENT,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from Spotify using a Spotify track URL")
    .addStringOption((option) =>
      option
        .setName("track_url")
        .setDescription("The Spotify track URL")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const data = await spotifyApi.clientCredentialsGrant();
      const accessToken = data.body.access_token;

      spotifyApi.setAccessToken(accessToken);
      const trackUrl = interaction.options.getString("track_url");

      const member = interaction.guild.members.cache.get(interaction.user.id);
      const voiceChannel = member.voice.channel;
      if (!voiceChannel) {
        return await interaction.reply(
          "You need to be in a voice channel to use this command."
        );
      }

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      const resource = createAudioResource(trackUrl);
      player.play(resource);
      connection.subscribe(player);

      await interaction.reply(`Now playing: ${trackUrl}`);
    } catch (error) {
      console.error("Error playing track:", error);
      await interaction.reply("An error occurred while playing the track.");
    }
  },
};
