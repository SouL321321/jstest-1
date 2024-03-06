const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

const player = createAudioPlayer();
const queue = [];

module.exports = {
  player,
  queue,
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song or playlist from YouTube using a YouTube URL")
    .addStringOption((option) =>
      option
        .setName("track_url")
        .setDescription("The YouTube URL of the song or playlist")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const trackUrl = interaction.options.getString("track_url");

      const voiceChannel = interaction.member.voice.channel;
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

      const stream = ytdl(trackUrl, { filter: "audioonly" });
      const resource = createAudioResource(stream);
      
      queue.push(resource);

      if (queue.length === 1) {
        player.play(queue[0]);
        connection.subscribe(player);
      }

      const info = await ytdl.getInfo(trackUrl);
      const embed = new EmbedBuilder()
        .setTitle(info.videoDetails.title)
        .setThumbnail(info.videoDetails.thumbnail.thumbnails[0].url)
        .setDescription(`Added to queue: ${info.videoDetails.title}`);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error playing track:", error);
      await interaction.reply("An error occurred while playing the track.");
    }
  },
};
