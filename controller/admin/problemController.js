const request = require("request");
const Problem = require("../../modals/problemSchema");

const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });
const accessToken = process.env.ACCESS_TOKEN;
const endpoint = process.env.ENDPOINT;

//controller for creating problem using sphere engine and storing problem detail in DB
exports.problemCreation = async (req, res) => {
  const { problemName, problemDescription, masterJudgeId, type } = req.body;

  //defining problem parameter
  var problemData = {
    name: problemName,
    masterjudgeId: masterJudgeId,
    body: problemDescription,
    typeId: type,
  };

  try {
    request(
      {
        url:
          "https://" +
          endpoint +
          "/api/v4/problems?access_token=" +
          accessToken,

        method: "POST",
        form: problemData,
      },
      async function (error, response, body) {
        if (error) {
          console.log("Connection problem");
        }

        // process response
        if (response) {
          if (response.statusCode === 201) {
            result = JSON.parse(response.body);
            const problemId = result.id;
            const problemCode = result.code;
            const problemCreatedAt = new Date().valueOf();

            //storing problem to database
            const problem = new Problem({
              problemId,
              problemCode,
              problemCreatedAt,
            });

            const problemEntered = await problem.save();

            if (problemEntered) {
              res.status(201).json({
                message: "problem created and stored in DB successFully",
                result,
              });
            } else {
              res
                .status(400)
                .json({ message: "Problem created but not stored in DB" });
            }
          } else {
            //error handling
            if (response.statusCode === 401) {
              res.status(400).send("Invalid access token");
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
    res.status(400).json({ message: "Error in problem creation" });
  }
};

//controller for getting all the problem
exports.problemList = async (req, res) => {
  //getting limit from url
  //limit is no of problem to be fetched in one call
  //to be used in PAGINATION

  const limit = req.query.limit || 10;
  try {
    // send request
    request(
      {
        url:
          "https://" +
          endpoint +
          "/api/v4/problems?access_token=" +
          accessToken +
          "&limit=" +
          limit,
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

            //sending all the problem list
            res.status(200).json({ message: "All problem List", result });
          } else {
            if (response.statusCode === 401) {
              res.status(400).send("Invalid access token");
            }
          }
        }
      }
    );
  } catch (error) {
    res.status(400).json({ error: "Error in problemList", error });
  }
};

//controller for getting Whole description of specific problem
exports.problemDisplay = async (req, res) => {
  try {
    // getting id from params
    var problemId = req.params.id;

    // sending request
    request(
      {
        url:
          "https://" +
          endpoint +
          "/api/v4/problems/" +
          problemId +
          "?access_token=" +
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

            //sending problem description back to user
            res.status(200).json({ message: "Problem description", result });
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
  } catch (error) {
    res
      .status(400)
      .json({ message: "Problem in fetching problem description" });
  }
};

//controller to update problem details
exports.updateProblem = async (req, res) => {
  try {
    // define request parameters
    const problemId = req.params.id;
    const { problemName } = req.body;

    //defining problem parameter
    var problemData = {
      name: problemName,
    };

    // send request
    request(
      {
        url:
          "https://" +
          endpoint +
          "/api/v4/problems/" +
          problemId +
          "?access_token=" +
          accessToken,
        method: "PUT",
        form: problemData,
      },
      function (error, response, body) {
        if (error) {
          res.status(400).send("Connection problem");
        }

        // process response
        if (response) {
          if (response.statusCode === 200) {
            //successfull
            res.status(200).json({ message: "Problem Updated" });
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
      .json({ message: "Error in problem updation", error: error });
  }
};

//controller for deleting problem from sphere engine and database
exports.deleteProblem = async (req, res) => {
  try {
    // define request parameters
    var problemId = req.params.id;

    // send request
    request(
      {
        url:
          "https://" +
          endpoint +
          "/api/v4/problems/" +
          problemId +
          "?access_token=" +
          accessToken,
        method: "DELETE",
      },
      async function (error, response, body) {
        if (error) {
          res.status(400).send("Connection problem");
        }

        // process response
        if (response) {
          if (response.statusCode === 200) {
            //finding problem in database
            const problem = Problem.findOneAndDelete({
              problemId: problemId,
            });
            const deleteProblem = await problem.exec();

            if (deleteProblem) {
              res.status(200).json({ message: "Problem deleted successfully" });
            } else {
              res
                .status(400)
                .json({ message: "Problem deleted from sphere but not in DB" });
            }
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
  } catch (error) {
    res.status(400).json({ message: "Error in deleting problem" });
  }
};
