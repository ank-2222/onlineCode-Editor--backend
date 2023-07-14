const request = require("request");
const { getSubmissionDetail } = require("./submissionHelper");

const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });
const accessToken = process.env.ACCESS_TOKEN;
const endpoint = process.env.ENDPOINT;

exports.submissionCreation = async (req, res) => {
  
  //compiler id are different for diff language , c++ -> 1, python3 -> 116, reference sphere engine docs
  const { problemId, source, compilerId } = req.body;
  const userEmail = req.userEmail;
  try {
    // defining request parameters
    var submissionData = {
      problemId: problemId,
      compilerId: compilerId,
      source: source,
    };

    //to store submission id
    let submissionId;

    // sending submission request
    request(
      {
        url:
          "https://" +
          endpoint +
          "/api/v4/submissions?access_token=" +
          accessToken,
        method: "POST",
        form: submissionData,
      },
      function (error, response, body) {
        if (error) {
          res.status(400).send("Connection problem");
        }

        //giving settimeout for delay of 4 sec so as to get back submission id before getting submission detail

        setTimeout(function () {
          if (response) {
            if (response.statusCode === 201) {
              submissionId = JSON.parse(response.body);

              //calling function to get submission detail
              getSubmissionDetail(
                submissionId.id,
                accessToken,
                endpoint,
                res,
                userEmail
              );
            } else {
              //error handling
              if (response.statusCode === 401) {
                res.status(400).send("Invalid access token");
              } else if (response.statusCode === 402) {
                res.status(400).send("Unable to create submission");
              } else if (response.statusCode === 400) {
                var body = JSON.parse(response.body);
                res
                  .status(400)
                  .send(
                    "Error code: " +
                      body.error_code +
                      ", details available in the message: " +
                      body.message
                  );
              }
            }
          }
        }, 4000);
      }
    );
  } catch (error) {
    res.status(400).json({ message: "Error in submission", error });
  }
};
