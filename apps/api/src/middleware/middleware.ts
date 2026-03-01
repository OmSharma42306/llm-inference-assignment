import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


interface authRequest extends Request{
    userId? : string;
}

const jwt_secret : string = process.env.jwt_secret || '';
console.log('ddd',jwt_secret);
export function AuthMiddleware(req:authRequest,res:Response,next:NextFunction){
    const authHeaders = req.headers["authorization"];
    

    if(!authHeaders || !authHeaders.startsWith('Bearer ')){
        res.status(400).json({msg : "Invalid AuthHeaders"});
        return;
    }

    const token : any= authHeaders?.split(' ')[1];
    console.log(token);
    try{
        const decodedToken : any = jwt.verify(token,jwt_secret);
        console.log("decoded token",decodedToken);
        req.userId = decodedToken.userId;
        next();
    }catch(error){
        res.json({msg : 'token verification error'});
        return;
    }
}