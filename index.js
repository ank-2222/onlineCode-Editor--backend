const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");


require("dotenv").config({path:"./.env"});
const port = process.env.PORT||5050;

const connectDB = require("./database/db");


const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const participantRoutes = require('./routes/participantRoutes');


app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(cors());

app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/participant",participantRoutes);
app.get("/",(req,res)=>{
    res.status(200).json({message:`Welcome, Find all the Documentation in README file and Repo https://github.com/ank-2222/Sphere-engineApi`});
});

app.get("*",(req,res)=>{
    res.status(404).send({message:"Route not found"});
});


connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server Listening on Port ${port}`);
        });
    })
    .catch(console.log);