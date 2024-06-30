import mongoose from "mongoose";

// create mongoDB connection

const mongoDBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connection established".bgCyan.black);
  } catch (error) {
    console.log(`${error.message}`.bgRed.black);
  }
};

// export mongoDB connection

export default mongoDBConnection;
