import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("DB Connected");
        });

        mongoose.connection.on('error', (err) => {
            console.error(`DB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log("DB Disconnected");
        });

        await mongoose.connect(`${process.env.MONGODB_URL}/e-commerce`);
        console.log("MongoDB connection attempt initiated.");

    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;