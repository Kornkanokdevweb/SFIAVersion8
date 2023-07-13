import { Request, Response } from "express";
import { getRepository } from "typeorm";


exports.list = async (req:Response, res:Response) => {
    try{
        
    }catch(err){
        console.log(err);
        res.status(500).send('List Error');
    }
}