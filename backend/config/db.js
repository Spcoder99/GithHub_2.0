const { ENV } = require("./env");
const mongoose = require("mongoose");

const mongoURL = ENV.MONGODB_URL;

//arrange it in a variable

const connectDB = () => mongoose.connect(mongoURL).then(() => console.log("MongoDB Connected Successfully!!")).catch((error) => {console.error("Unable to connect with MONGO-DB : ", error); throw error;});

module.exports = { connectDB };