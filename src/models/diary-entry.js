const mongoose = require("mongoose");

const diaryEntrySchema = new mongoose.Schema({
  userId: String,
  entries: [
    {
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("DiaryEntry", diaryEntrySchema);
