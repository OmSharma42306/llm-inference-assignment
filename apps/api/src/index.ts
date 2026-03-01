import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/auth.js"
import ollama from "ollama"
import { connectDb } from "@repo/db"


const jwt_secret = process.env.jwt_secret;

const app = express();
const PORT = 8000;

connectDb();
app.use(express.json());

app.use('/user',userRoutes);


// auth endpoint

// infernce endpoint
app.get('/de',async(req:Request,res:Response)=>{
    const response = await ollama.chat({
  model: 'mistral',
  messages: [{role: 'user', content: 'Hello!'}],
});

console.log(response.message.content)
    res.status(200).json("hello");
    return;
});




app.listen(PORT,()=>{
    console.log(`Server Started at PORT : ${PORT}`);
});