const User = require("../../modals/user");
const { encPassword } = require("../../utils/password");
const jwt = require("jsonwebtoken");


//registration controller
const registerUser = async (req, res) => {
  //getting user details
  const { name, email, password, role } = req.body;

  //validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Field is empty" });
  }

  try {
    //checking if user already exist
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "user already exists" });
    }

    //calling utility function to get hashed password
    const hashedPass = await encPassword(password,res);
    const user = new User({ name, email, password: hashedPass, role });

    const userRegistered = await user.save();

    //once user is registered, we are creating jwt token with userId and email with an expiration of 24hour
    if (userRegistered) {
      const accessToken = jwt.sign(
        {
          _id: user._id,
          email,
        },
        process.env.TOKEN_KEY,
        { expiresIn: "24h" }
      );


      //sending accesstoken and registered mail after successfull registration
      res.status(201).json({
        message: "user registered successfully",
        accessToken,
        email: user.email,
      });
    } else {
      res.status(500).json({ error: "failed to registered" });
    }
  } catch (error) {
    res.status(400).json({ message: "Problem in registration of user" });
  }
};

module.exports = { registerUser };
