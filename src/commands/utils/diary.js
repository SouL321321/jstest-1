const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");
const { authenticateUser } = require("../auth/auth-diary");
const DiaryEntry = require("../../models/diary-entry");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("diary")
    .setDescription("Manage your personal diary/note system.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("read")
        .setDescription("Read your diary entries.")
        .addIntegerOption((option) =>
          option
            .setName("page")
            .setDescription("The page number of diary entries.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a new diary entry.")
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription("The content of your diary entry.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete a diary entry.")
        .addIntegerOption((option) =>
          option
            .setName("index")
            .setDescription("The index of the entry to delete.")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const user = interaction.user;
    const subcommand = interaction.options.getSubcommand();
    const password = interaction.options.getString("password");

    try {
      await authenticateUser(user.id, password);
    } catch (error) {
      await interaction.reply(
        "You are not authenticated. Please use `/login` or `/register`."
      );
      return;
    }

    switch (subcommand) {
      case "read":
        await handleReadCommand(interaction, user.id);
        break;
      case "create":
        await handleCreateCommand(interaction, user.id);
        break;
      case "delete":
        await handleDeleteCommand(interaction, user.id);
        break;
      default:
        await interaction.reply("Invalid subcommand.");
    }
  },
};

async function handleReadCommand(interaction, userId) {
  const page = interaction.options.getInteger("page") || 1;
  const entries = await getDiaryEntries(userId);

  if (!entries || entries.length === 0) {
    await interaction.reply("Your diary is empty.");
    return;
  }

  await displayDiaryEntries(interaction, entries, page);
}

async function handleCreateCommand(interaction, userId) {
  const content = interaction.options.getString("content");
  const diary = await getOrCreateDiary(userId);

  await addDiaryEntry(diary, content);
  await interaction.reply("Your entry has been added to your diary!");
}

async function handleDeleteCommand(interaction, userId) {
  const index = interaction.options.getInteger("index");
  const diary = await getDiary(userId);

  if (!diary || diary.entries.length === 0) {
    await interaction.reply("Your diary is empty.");
    return;
  }

  await deleteDiaryEntry(interaction, diary, index);
}

async function getDiaryEntries(userId) {
  const diary = await DiaryEntry.findOne({ userId });
  return diary ? diary.entries : [];
}

async function displayDiaryEntries(interaction, entries, page) {
  const entriesPerPage = 5;
  const totalPages = Math.ceil(entries.length / entriesPerPage);

  if (page < 1 || page > totalPages) {
    await interaction.reply("Invalid page number.");
    return;
  }

  const startIndex = (page - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, entries.length);
  const displayedEntries = entries.slice(startIndex, endIndex);

  const embed = new EmbedBuilder()
    .setTitle("Diary Entries")
    .setDescription(`Page ${page}/${totalPages}`)
    .setColor("#3498db");

  displayedEntries.forEach((entry, index) => {
    const entryIndex = startIndex + index + 1;
    embed.addFields({ name: `Entry ${entryIndex}`, value: entry.content });
  });

  await interaction.reply({ embeds: [embed] });
}

async function getOrCreateDiary(userId) {
  let diary = await DiaryEntry.findOne({ userId });

  if (!diary) {
    diary = new DiaryEntry({ userId, entries: [] });
    await diary.save();
  }

  return diary;
}

async function addDiaryEntry(diary, content) {
  diary.entries.push({ content });
  return diary.save();
}

async function deleteDiaryEntry(interaction, diary, index) {
  if (index < 1 || index > diary.entries.length) {
    await interaction.reply("Invalid entry index.");
    return;
  }

  diary.entries.splice(index - 1, 1);
  await diary.save();
  await interaction.reply("Your entry has been deleted from your diary!");
}
