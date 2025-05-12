import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    // Config options pour Mongoose
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log("DataBase Connected");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB Atlas :", error);
    process.exit(1);
  }
};

export default connectDB;