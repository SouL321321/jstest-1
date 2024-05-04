//Credits for help: Nexus20060 (772588871606468611)


const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const { profileImage } = require("discord-arts");

module.exports = {
  countdown: true,
  data: new SlashCommandBuilder()
    .setName("member-info")
    .setDescription(
      "[🚫YOU CAN NOT SEE ALL YOUR BADGES🚫!] View your or any member's information.👤"
    )
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("Select a member to view their information")
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const member =
      interaction.options.getMember("member") || interaction.member;

    if (member.user.bot) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder().setDescription(
            "Bots are not supported for this command."
          ),
        ],
        ephemeral: true,
      });
    }

    try {
      const fetchedMembers = await interaction.guild.members.fetch();
      const sortedMembers = Array.from(fetchedMembers.values()).sort((a, b) => a.joinedAt - b.joinedAt);
      const joinPosition = sortedMembers.findIndex((m) => m.id === member.id) + 1;

      // let profileBuffer;
      // try {
      //   profileBuffer = await profileImage(member.id);
      // } catch (imageError) {
      //   console.error("Error retrieving profile image:", imageError);
      // }

      // const imageAttachment = profileBuffer
      //   ? new AttachmentBuilder(profileBuffer, { name: "profile.png" })
      //   : null;

      const topRoles = member.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition).map((role) => role).slice(0, 3);


      const joinTime = parseInt(member.joinedTimestamp / 1000);
      const createdTime = parseInt(member.user.createdTimestamp / 1000);

      const boosterStatus = member.premiumSince ? "Yes" : "No";

      const embed = new EmbedBuilder()
        .setColor(member.displayColor)
        .setAuthor({
          name: `${member.user.tag} | General Information`,
          iconURL: member.displayAvatarURL(),
        })
        .setDescription(`On <t:${joinTime}:D>, ${member.user.username} joined as the **${addSuffix(joinPosition)}** member of this guild`)
        .addFields(
          {
            name: "Badges",
            value: getUserBadges(member.user).join(""),
            inline: true,
          },
          { name: "Booster", value: boosterStatus, inline: true },
          {
            name: "Top Roles",
            value: topRoles.join("\n").replace("@everyone"),
            inline: false,
          },
          { name: "Created", value: `<t:${createdTime}:R>`, inline: true },
          { name: "Joined", value: `<t:${joinTime}:R>`, inline: true },
          { name: "Identifier", value: member.id, inline: false },
          {
            name: "Avatar",
            value: `[Link](${member.displayAvatarURL()})`,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({
        embeds: [embed],
        // files: imageAttachment ? [imageAttachment] : [],
      });
    } catch (error) {
      console.error(error);
      interaction.editReply({
        content: "An error occurred. Please contact the developers!",
      });
    }
  }
};

function addSuffix(number) {
  if (number % 100 >= 11 && number % 100 <= 13) return number + "th";
  switch (number % 10) {
    case 1:
      return number + "st";
    case 2:
      return number + "nd";
    case 3:
      return number + "rd";
  }
  return number + "th";
}

function getUserBadges(user) {
  function badgeSettings() {
    const badgeList = {
      ActiveDeveloper: "<:activedeveloper:1216582495651233902>",
      BugHunterLevel1: "<:discordbughunter1:1216582503129681981>",
      BugHunterLevel2: "<:discordbughunter2:1216582505453584575>",
      PremiumEarlySupporter: "<:discordearlysupporter:1216582506871128156>",
      Partner: "<:discordpartner:1216582512785231882>",
      Staff: "<:discordstaff:1216582514643042304>",
      Username: "<:username:1229824401038508052>",
      HypeSquadOnlineHouse1: "<:hypesquadbravery:1216582518476767282>",
      HypeSquadOnlineHouse2: "<:hypesquadbrilliance:1216582520573923328>",
      HypeSquadOnlineHouse3: "<:hypesquadbalance:1216582516602044456>",
      Hypesquad: "<:hypesquadevents:1216582556846264411>",
      CertifiedModerator: "<:discordmod:1216582508498518066>",
      CertifiedDeveloper: "<:discordbotdev:1216582500818620456>",
      DiscordNitro: "<:discordnitro:1216582511178809375>",
      DiscordBoost1: "<:discordboost1:1229831185178296420>",
      DiscordBoost2: "<:discordboost2:1229831212546261032>",
      DiscordBoost3: "<:discordboost3:1229831214391754853>",
      DiscordBoost7: "<:discordboost7:1216582498578993163>",
    }
    const badge_order = {
      "Staff": 0,
      "Partner": 1,
      "CertifiedModerator": 2,
      "Hypesquad": 3,
      "HypeSquadOnlineHouse1": 4,
      "HypeSquadOnlineHouse2": 5,
      "HypeSquadOnlineHouse3": 6,
      "BugHunterLevel1": 7,
      "BugHunterLevel2": 8,
      "ActiveDeveloper": 9,
      "CertifiedDeveloper": 10,
      "PremiumEarlySupporter": 11,
    }
    return { badgeList, badge_order }
  }

  const setting = badgeSettings();
  let badges = [];

  // add the user badges
  user.flags.toArray().forEach(badge => {
    badges.push(setting.badgeList[badge]);
  });

  // checks if the user has an banner or an animated avatar
  if (user.banner || user.displayAvatarURL().includes("a_")) {
    badges.push(setting.badgeList["DiscordNitro"]);
  }

  // checks if the user's discriminator is 0000 and is was created before this date
  if (user.discriminator === "0" && user.createdAt <= new Date(1690535839000)) {
    badges.push(setting.badgeList["Username"]);
  }

  // sort the badges
  badges = badges.sort((a, b) => setting.badge_order[a] - setting.badge_order[b]) 

  if(badges.length == 0) badges.push("No Badges")

  return badges;
}
