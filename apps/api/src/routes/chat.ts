import type { Request,Response } from "express";
import { Router } from "express";
import { AuthMiddleware } from "../middleware/middleware.js";
import { inferenceRateLimiter } from "../rateLimiter.js";
import ollama from "ollama";
import { recordLatency } from "../metrics-service/metrics.service.js";
const router = Router();

interface authRequest extends Request{
    userId? : string;
}

router.post('/v1/infer',AuthMiddleware,inferenceRateLimiter,async(req:authRequest,res:Response)=>{
    try{
        const prompt = req.body.prompt;
        if(!prompt) return res.status(400).json({ msg : "prompt not given!"});
        
        const start = process.hrtime.bigint();
        const modelStart = process.hrtime.bigint();
        
        const response = await ollama.chat({
            model : "mistral",
            messages:[{role : 'user',content : prompt}]
        });
        
        const modelEnd = process.hrtime.bigint();
        const end = process.hrtime.bigint();

        const totalMs = Number(end - start) / 1e6;
        const modelMs = Number(modelEnd - modelStart) / 1e6;
        const overheadMs = totalMs - modelMs;
        console.log({
      userId: req.userId,
      promptLength: prompt.length,
      totalMs,
      modelMs,
      overheadMs,
      status: "success"
    });

        recordLatency(totalMs);

    const content = response.message.content;
        res.status(200).json({ msg : content,latency: {
        totalMs,
        modelMs,
        overheadMs
      }});
        return;    
    }catch(error){
        res.status(400).json({ msg : error});
        return;
    }
});

export default router;

