const mongoose = require("mongoose");

async function connectDB() {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Succesfully connected to mongoDB`.bgGreen.black);
  } catch (error) {
    console.log(
      `Error while trying to connect to mongoDB ${error}`.bgRed
    );
    // process.exit(1);
  }
}

module.exports = {
  connectDB,
};
