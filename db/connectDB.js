import mongoose from "mongoose";
import dotenv from"dotenv";

dotenv.config()
const connectDB = async () =>{
    try {
        const res = await mongoose.connect(process.env.DB_URL)
        console.log(`Connected to DB ${res.connection.host}`);
        
    } catch (error) {
        console.log( "Error",error );
        process.exit(1)
        
    }
}

export default connectDB
