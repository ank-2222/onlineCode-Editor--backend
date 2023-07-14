const nodemailer = require("nodemailer");

//creating transporter using ethereal for testing purpose

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "carmella6@ethereal.email",
    pass: "DBkQwDEcmx6ZM6cnKS",
  },
});

//function to send submission email
exports.sendingSubmission = async (submissionId, submissionStatus, toMail) => {
  try {
    const info = await transporter.sendMail({
      from: '"Fakery" <carmella6@ethereal.email>', // sender address
      to: toMail, // list of receivers
      subject: "Submission Details", // Subject line
      text: `
            Your Submission ID = ${submissionId}
            Submission Status = ${submissionStatus}
            `, // plain text body
      html: `
       <b> Your Submission ID = ${submissionId}</b>
       <b> Your Submission Status = ${submissionStatus}</b>
              
       `, // html body
    });

    // console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("error in sending mail");
  }
};
