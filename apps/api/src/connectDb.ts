import mongoose from "mongoose";

export async function connectDb(){
    console.log(process.env.MONGOOSE_URL)
    await mongoose.connect(process.env.MONGOOSE_URL||"");
}