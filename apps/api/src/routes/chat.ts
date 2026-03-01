import type { Request,Response } from "express";
import { Router } from "express";
import { AuthMiddleware } from "../middleware/middleware.js";
import ollama from "ollama";
const router = Router();

router.post('/v1/infer',AuthMiddleware,async(req:Request,res:Response)=>{
    try{
        const prompt = req.body.prompt;
        if(!prompt) return res.status(400).json({ msg : "prompt not given!"});
        const response = await ollama.chat({
            model : "mistral",
            messages:[{role : 'user',content : prompt}]
        });
        const content = response.message.content;
        res.status(200).json({ msg : content});
        return;

    }catch(error){
        res.status(400).json({ msg : error});
        return;
    }
});

export default router;

