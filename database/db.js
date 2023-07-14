const mongoose = require("mongoose");
 const dotenv = require("dotenv");
dotenv.config({path:"../.env"});

dotenv.config();

//creating connection 
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {

        console.error('Error connecting to mongo', error);
    }
};
module.exports = connectDB;