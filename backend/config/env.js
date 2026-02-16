const dotenv = require("dotenv");
dotenv.config();

const ENV = {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    MONGODB_URL: process.env.MONGODB_URL,
    PORT: process.env.PORT,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
};

module.exports = { ENV };