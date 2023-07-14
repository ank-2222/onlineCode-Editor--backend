const { verifyPassword } = require("../../utils/password");
var jwt = require("jsonwebtoken");
const User = require("../../modals/user");


//login controller
exports.loginUser = async (req, res) => {
  //getting user data
  const { email, password } = req.body;

  //data validation
  if (!email || !password) {
    res.status(400).json({ error: "Field is Empty" });
  }

  //checking user
  const userlogin = await User.findOne({ email: email });

  //if user found then verifying password
  if (userlogin) {
    const isMatch = await verifyPassword(password, userlogin.password,res);

    if (!isMatch) {
      res.status(400).json({ error: "Invalid Credential" });
    } else {

      //if password is matched, generating jwt token
      const accessToken = jwt.sign(
        {
          _id: userlogin._id,
          email,
        },
        process.env.TOKEN_KEY,
        { expiresIn: "24h" }
      );

      //sending jwtToken and email of user after successfull Login
      res.status(201).json({
        success: true,
        accessToken,
        email: userlogin.email,
        message: "User SignIn Successfully",
      });
    }
  } else {
    res.status(400).json({ error: "Invalid Credentials" });
  }
};
