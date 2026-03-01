import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/auth.js";
import inferenceRoutes from "./routes/chat.js";
import { connectDb } from "./connectDb.js";
import { getMetrics } from "./metrics-service/metrics.service.js";
import { warmup } from "./warmup-model/warmup-model.js";

warmup();
dotenv.config();

const app = express();
const PORT = 8000;

connectDb();

app.use(express.json());
app.use('/user',userRoutes);
app.use('/inference',inferenceRoutes);


app.get('/metrics',(req:Request,res:Response)=>{
    res.json(getMetrics());
})

app.listen(PORT,()=>{
    console.log(`Server Started at PORT : ${PORT}`);
});