import mongoose from "mongoose";

const DB_NAME = "test";
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        // console.log(
        //     `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
        // );
    } catch (error) {
        console.error("connectDB Error: ", error);
        process.exit(1);
    }
};

export default connectDB;