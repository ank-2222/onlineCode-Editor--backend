const express = require("express");
const { registerUser } = require("../controller/auth/registerController");
const { loginUser } = require("../controller/auth/loginController");
const router = express.Router();

//Routes for registration and login
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
