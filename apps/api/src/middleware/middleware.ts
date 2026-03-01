import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";


interface authRequest extends Request{
    userId? : string;
}

export function AuthMiddleware(req:authRequest,res:Response,next:NextFunction){
    const authHeaders = req.headers["authorization"];
    

    if(!authHeaders || !authHeaders.startsWith('Bearer ')){
        res.status(400).json({msg : "Invalid AuthHeaders"});
        return;
    }

    const token : any= authHeaders?.split(' ')[1];
    console.log(token);
    try{
        const decodedToken : any = verify(token,'dew');
        req.userId = decodedToken.userId;
        next();
    }catch(error){
        res.json({msg : 'token verification error'});
        return;
    }
}