const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  },
  relation: {
    type: String
  }
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    age: {
      type: Number
    },

    gender: {
      type: String
    },

    familyMembers: [familyMemberSchema]
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);