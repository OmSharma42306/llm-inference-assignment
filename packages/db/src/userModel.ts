import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();
console.log('111',process.env.MONGOOSE_URL);
export async function connectDb(){
    console.log(process.env.MONGOOSE_URL)
    await mongoose.connect(process.env.MONGOOSE_URL||"");
}


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        maxLength : 40
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
        minLength : 8
    }
});

export const Users = mongoose.model('Users',userSchema);
