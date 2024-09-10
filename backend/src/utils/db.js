import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const mongoDbInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      "Connected to Mongo Db Instance:",
      mongoDbInstance.connection.host
    );
  } catch (error) {
    console.log("Mongo DB Connection failed.", error);
    process.exit(1);
  }
};
