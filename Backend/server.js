import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
// const PORT = 8080;
const PORT = process.env.PORT || 8080;


app.use(cors({
  origin: [
    "http://localhost:5173",          // Vite dev (if you use Vite)
    "http://localhost:3000",          // CRA dev (if you use CRA)
    "https://your-frontend.onrender.com" // after you deploy frontend
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));

app.use(express.json());
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