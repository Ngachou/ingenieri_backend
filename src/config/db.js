require("dotenv").config()
const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB Connected successfully !");
    } catch (e) {
        console.error("Error occured while trying to connect DB ", e)
        process.exit(1)
    }
}

module.exports = connectDB