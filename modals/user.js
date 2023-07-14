const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {                //user name
    type: String,
    required: true,
    trim: true,
  },

  email: {               //user email
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },

  password: {            //user password
    type: String,
    required: true,
    trim: true,
  },
  role: {                //user role - admin, participant
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

const user = new mongoose.model("user", userSchema);

module.exports = user;
