const jwt = require("jsonwebtoken");
const User = require("../modals/user");


//Middleware to authenticate admin
const auth = async (req, res, next) => {
  try {
    const token = req.body.token || req.headers["auth-token"];
    if(!token){
    return res.status(400).json({message:"Token required for Authentication"});
    }

    //verifying token
    const verifyToken = jwt.verify(token, process.env.TOKEN_KEY);

    //finding user in DB
    const rootUser = await User.findOne({
      email: verifyToken.email,
     
    });
    if (!rootUser) {
     return res.status(404).json({message:"User not found"});
    }

    //verifying if user is admin or not
    if(rootUser.role !== 'admin'){
    return res.status(400).json({message:"Only admins are allowed"});
    }

    req.token = token;

    req.userId = rootUser._id;
    req.role = rootUser.role;
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With",
      "Content-Type",
      "x-access-token"
    );
    return next();
  } catch (err) {
    res.status(401).json({error:"Error in authentication!!"});
  }
};

module.exports = auth;
