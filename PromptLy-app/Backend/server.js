import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
// const PORT = 8080;
const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes);

app.listen(PORT,() => {
    console.log(`server running on ${PORT}`);
    connectDB();
});

const connectDB = async() => {
    try{
       await mongoose.connect(process.env.MONGODB_URI);
       console.log("connected with Database");
    }catch(err){
       console.log("fialed to connect with the DB",err);
    }
}