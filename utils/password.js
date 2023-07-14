const brcypt = require("bcryptjs");

//to create hashed password

const saltRounds = 10;
exports.encPassword = async (password,res) => {
  try {
    const hash = await brcypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    res.status(400).send("error in password generation");
  }
};

//to verify hashed password

exports.verifyPassword = async (userPassword, hashedPassword,res) => {
  try {
    const isMatch = await brcypt.compare(userPassword, hashedPassword);
    if (isMatch) {
      return true; //matched
    } else {
      return false; //unauthorized
    }
  } catch (error) {
    console.error("Password comparison error:", error);
    res.status(400).send("error in password comparision");
  }
};
