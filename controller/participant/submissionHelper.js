var request = require("request");
const { sendingSubmission } = require("../../utils/mailService");


//controller for getting submission detail
exports.getSubmissionDetail = async (
  submissionId,
  access_token,
  endpoint,
  res,
  userEmail
) => {
  try {
    // sending submission detail request
    request(
      { 
        //sphere engine url
        url:
          "https://" +
          endpoint +
          "/api/v4/submissions/" +
          submissionId +
          "?access_token=" +
          access_token,
        method: "GET",
      },
      (error, response, body) => {
        if (error) {
          res.status(400).send("Connection problem");
        }

        // process response
        if (response) {
          if (response.statusCode === 200) {
            const submissionData = JSON.parse(response.body);

            //sending submission details to User's Email
            sendingSubmission(
              submissionData.id,
              submissionData.result?.status?.name,
              userEmail
            );

            //sending error detail to user when submission contains compilation error(11) or runtime error(12)
            if (
              submissionData?.result.status?.code === 11 ||
              submissionData?.result.status?.code === 12
            ) {
              res.status(200).json({
                message: submissionData.result?.status?.name,
                error: submissionData?.streams?.error?.uri,
              });
            }
            // sending result status (accepted/wrong answer)
            else {
              res.status(200).json({ message: submissionData?.result?.status });
            }
          } else {
            if (response.statusCode === 401) {
              res.status(400).send("Invalid access token");
            } else if (response.statusCode === 403) {
              res.status(400).send("Access denied");
            } else if (response.statusCode === 404) {
              res.status(400).send("Submision not found");
            }
          }
        }
      }
    );
  } catch (error) {
    res.status(400).json({ message: "error in submission helper", error });
  }
};
