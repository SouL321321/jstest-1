const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { profileImage } = require("discord-arts");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("member-info")
    .setDescription("View your or any member's information. 👤")
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
      const sortedMembers = Array.from(fetchedMembers).sort(
        (a, b) => a.joinedAt - b.joinedAt
      );
      const joinPosition =
        sortedMembers.findIndex((m) => m[1].id === member.id) + 1;

      let profileBuffer;
      try {
        profileBuffer = await profileImage(member.id);
      } catch (imageError) {
        console.error("Error retrieving profile image:", imageError);
      }

      const imageAttachment = profileBuffer
        ? new AttachmentBuilder(profileBuffer, { name: "profile.png" })
        : null;

      const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role)
        .slice(0, 3);

      const userBadges = member.user.flags.toArray();

      const joinTime = parseInt(member.joinedTimestamp / 1000);
      const createdTime = parseInt(member.user.createdTimestamp / 1000);

      const Booster = member.premiumSince
        ? "<:discordboost7:1216582498578993163>"
        : "❌";

      const embed = new EmbedBuilder()
        .setColor(member.displayColor)
        .setAuthor({
          name: `${member.user.tag} | General Information`,
          iconURL: member.displayAvatarURL(),
        })
        .setDescription(
          `On <t:${joinTime}:D>, ${
            member.user.username
          } joined as the **${addSuffix(joinPosition)}** member of this guild`
        )
        .addFields(
          {
            name: "Badges",
            value: addBadges(userBadges).join(""),
            inline: true,
          },
          { name: "Booster", value: Booster, inline: true },
          {
            name: "Top Roles",
            value: topRoles.join("\n").replace(`<@${interaction.guildId}>`),
            inline: false,
          },
          { name: "Created", value: `<t:${createdTime}:R>`, inline: true },
          { name: "Joined", value: `<t:${joinTime}:R>`, inline: true },
          { name: "Identifier", value: member.id, inline: false },
          {
            name: "Avatar",
            value: `[Link](${member.displayAvatarURL()})`,
            inline: true,
          },
          {
            name: "Banner",
            value: `[Link](${
              (await member.user.fetch()).bannerURL() || "No Banner"
            })`,
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
        files: imageAttachment ? [imageAttachment] : [],
      });
    } catch (error) {
      console.error(error);
      interaction.editReply({
        content: "An error occurred. Please contact the developers!",
      });
    }
  },
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

function addBadges(badgeNames) {
  const badgeMap = {
    ActiveDeveloper: "<:activedeveloper:1216582495651233902>",
    BugHunterLevel1: "<:discordbughunter1:1216582503129681981>",
    BugHunterLevel2: "<:discordbughunter2:1216582505453584575>",
    PremiumEarlySupporter: "<:discordearlysupporter:1216582506871128156>",
    Partner: "<:discordpartner:1216582512785231882>",
    Staff: "<:discordstaff:1216582514643042304>",
    HypeSquadOnlineHouse1: "<:hypesquadbalance:1216582516602044456>",
    HypeSquadOnlineHouse2: "<:hypesquadbravery:1216582518476767282>",
    HypeSquadOnlineHouse3: "<:hypesquadbrilliance:1216582520573923328>",
    Hypesquad: "<:hypesquadevents:1216582556846264411>",
    CertifiedModerator: "<:discordmod:1216582508498518066>",
    CertifiedDeveloper: "<:discordbotdev:1216582500818620456>",
    DiscordBoost: "<:discordboost7:1216582498578993163>",
  };

  if (badgeNames && badgeNames.length > 0) {
    return badgeNames.map((badgeName) => badgeMap[badgeName]).filter(Boolean);
  } else {
    return ["⚠️ No badges ⚠️"];
  }
}
