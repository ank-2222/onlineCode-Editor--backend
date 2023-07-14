const request = require("request");

const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });
const accessToken = process.env.ACCESS_TOKEN;
const endpoint = process.env.ENDPOINT;

//controller for adding test case to problem
exports.addTestcase = async (req, res) => {
  try {
    //getting test case and problem details
    const { problemId, input, output, timeLimit, judgeId } = req.body;

    //defining testcase parameter
    var testcaseData = {
      input: input,
      output: output,
      timelimit: timeLimit,
      judgeId: judgeId,
    };

    // sending  request
    request(
      {
        url:
          "https://" +
          endpoint +
          "/api/v4/problems/" +
          problemId +
          "/testcases?access_token=" +
          accessToken,
        method: "POST",
        form: testcaseData,
      },
      (error, response, body) => {
        if (error) {
          res.status(400).send("Connection problem");
        }

        // process response
        if (response) {
          if (response.statusCode === 201) {
            //sending result back
            const result = JSON.parse(response.body);
            res
              .status(200)
              .json({ message: "test case added successfully", result });
          } else {
            //error handling
            if (response.statusCode === 401) {
              res.status(400).send("Invalid access token");
            } else if (response.statusCode === 403) {
              res.status(400).send("Access denied");
            } else if (response.statusCode === 404) {
              res.status(400).send("Problem does not exist");
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
      }
    );
  } catch (error) {
    res
      .status(400)
      .json({ message: "Problem in adding testcase", error: error });
  }
};



//controller for getting all test case of specific problem
exports.getTestcase = async (req, res) => {
  try {
    // getting problem id from params
    const problemId = req.params.id;

    // sending request
    request(
      {
        url:
          "https://" +
          endpoint +
          "/api/v4/problems/" +
          problemId +
          "/testcases?access_token=" +
          accessToken,
        method: "GET",
      },
      function (error, response, body) {
        if (error) {
          res.status(400).send("Connection problem");
        }

        // process response
        if (response) {
          if (response.statusCode === 200) {
            const result = JSON.parse(response.body);

            res.status(200).json({ message: "All test cases", result });
          } else {
            //error handling
            if (response.statusCode === 401) {
              res.status(400).send("Invalid access token");
            } else if (response.statusCode === 403) {
              res.status(400).send("Access denied");
            } else if (response.statusCode === 404) {
              res.status(400).send("Problem not found");
            }
          }
        }
      }
    );
  } catch (error) {}
};
