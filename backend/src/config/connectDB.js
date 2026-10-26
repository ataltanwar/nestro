import mongoose from "mongoose";

const connectDB = async () => {
	if (!process.env.DB_URL) {
		throw new Error("DB_URL is not defined in the environment");
	}

	await mongoose.connect(process.env.DB_URL);
	console.log("Database connected!");
};

export default connectDB;
