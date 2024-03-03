const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("earthquake")
    .setDescription("Get recent earthquake data"),

  async execute() {
    const axios = require("axios");

    const options = {
      method: "GET",
      url: "https://everyearthquake.p.rapidapi.com/significant_hour.json",
      headers: {
        "X-RapidAPI-Key": process.env.EARTHQUAKE_API,
        "X-RapidAPI-Host": "everyearthquake.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  },
};


// TO FIX !!