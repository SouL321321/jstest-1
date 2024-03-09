const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const argon2 = require("argon2");

const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = model("User", userSchema);

async function registerUser(userId, password) {
  try {
    const hashedPassword = await argon2.hash(password);

    const newUser = new UserModel({ userId, password: hashedPassword });
    await newUser.save();
    return true;
  } catch (error) {
    if (error.code === 11000) {
      console.error("Error registering user: User with this ID already exists");
      throw new Error("User with this ID already exists");
    } else {
      console.error("Error registering user:", error);
      throw error;
    }
  }
}

async function authenticateUser(userId, password) {
  try {
    const user = await UserModel.findOne({ userId });

    if (!user) {
      console.error("User not found");
      throw new Error("User not found");
    }

    if (user.password === null || user.password === undefined) {
      console.error("User password is null or undefined");
      throw new Error("User password is null or undefined");
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      console.error("Invalid password");
      throw new Error("Invalid password");
    }

    console.log("User authenticated successfully");
    return true;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
}

module.exports = { registerUser, authenticateUser };











































































