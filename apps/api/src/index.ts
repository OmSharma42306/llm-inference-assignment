import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/auth.js";
import inferenceRoutes from "./routes/chat.js";
import { connectDb } from "./connectDb.js";

dotenv.config();

const app = express();
const PORT = 8000;

connectDb();

app.use(express.json());
app.use('/user',userRoutes);
app.use('/inference',inferenceRoutes);


app.listen(PORT,()=>{
    console.log(`Server Started at PORT : ${PORT}`);
});