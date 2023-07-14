const express = require("express");
const authParticipant = require("../middleware/authParticipant");
const {
  submissionCreation,
} = require("../controller/participant/participantController");

const router = express.Router();

//to create submission and fetch detail of submissions
router.post("/submissions", authParticipant, submissionCreation);

module.exports = router;
