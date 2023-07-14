const mongoose = require("mongoose");
const problemSchema = new mongoose.Schema({
  problemId: {            //problem ID given by sphere Engine
    type: Number,
    required: true,
    trim: true,
  },
  problemCode: {          //problemCode given by sphere Emgine
    type: String,
    required: true,
    trim: true,
  },
  problemCreatedAt: {      //date and time of problem creation
    type: Date,
    required: true,
  },
});

const problem = new mongoose.model("problem", problemSchema);

module.exports = problem;
