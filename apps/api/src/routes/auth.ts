import express, { type Request, type Response } from "express";
import {SignInSchema,SignUpScheama} from "@repo/common";
import { Users } from "@repo/db";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();

const jwt_secret : string = process.env.jwt_secret || '';
const router = express.Router();

router.post('/signup',async (req:Request,res:Response)=>{
    try{
        const { success } = SignUpScheama.safeParse(req.body);
        if(!success){
            res.status(300).json({ msg : 'Invalid Data!'});
            return;
        }

        const {name, email,password} = req.body;
        
        const existingUser = await Users.findOne({email : email});
        if(existingUser){
            res.status(409).json({msg : "user already exists! log in.." });
            return;
        } 

        const newUser = await Users.create({
            name : name,
            email : email,
            password : password
        });
        
        await newUser.save();
        res.status(200).json({ msg : "SignUp Succesful! Log in.."});
        return;

    }catch(error){
        res.status(400).json({ msg : error});
        return;
    }
});

router.post('/signin',async(req:Request,res:Response)=>{
    try{
        const { success } = SignInSchema.safeParse(req.body);
        
        if(!success){
            res.status(400).json({ msg : "Invalid Data!"});
            return;
        };
        const {email,password} = req.body;

        const existingUser = await Users.findOne({ 
            email : email
        });

        if(!existingUser){
            res.status(404).json({ msg : 'user not exists! please signup first!'});
            return;
        }

        if (existingUser.password !== password) {
            return res.status(400).json({ msg: "Invalid Credentials.!" });
        }

        const token = jwt.sign({ userId: existingUser.id }, jwt_secret);

        res.status(200).json({ authToken: token, msg: "Login Successful!" });
    
        return;
    }catch(error){
        res.status(400).json({ msg : error});
        return;
    }   
})

export default router;
