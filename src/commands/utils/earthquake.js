// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const axios = require("axios");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("earthquake")
//     .setDescription("Get recent earthquake data"),

//   async execute(interaction) {
//     const options = {
//       method: "GET",
//       url: "https://everyearthquake.p.rapidapi.com/query",
//       headers: {
//         "X-RapidAPI-Key": process.env.EARTHQUAKE_API,
//         "X-RapidAPI-Host": "everyearthquake.p.rapidapi.com",
//       },
//       params: {
//         starttime: "2024-01-10T00:00:00",
//         endtime: "2024-01-11T00:00:00",
//         minlatitude: -90,
//         maxlatitude: 90,
//         minlongitude: -180,
//         maxlongitude: 180,
//         minmagnitude: 1,
//       },
//     };

//     try {
//       const response = await axios.request(options);
//       const earthquakeData = response.data;

//       const embed = new EmbedBuilder()
//         .setColor("#ff0000")
//         .setTitle("Recent Earthquake Data")
//         .setDescription("Here are the recent earthquakes:")
//         .setTimestamp();

//       earthquakeData.forEach((earthquake) => {
//         embed.addFields(
//           `${earthquake.properties.title}`,
//           `Magnitude: ${earthquake.properties.mag}\nLocation: ${earthquake.properties.place}`
//         );
//       });

//       await interaction.reply({ embeds: [embed] });
//     } catch (error) {
//       console.error(error);
//       await interaction.reply("Failed to fetch earthquake data.");
//     }
//   },
// };

// TO FIX