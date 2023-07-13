import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../Entity/user";

exports.list = async (req:Response, res:Response) => {
    try{
        const productRepository = getRepository(User);
        const product = await productRepository.find();
        res.send(product)
    }catch(err){
        console.log(err);
        res.status(500).send('List Error');
    }
}