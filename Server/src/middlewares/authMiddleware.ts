import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { myDataSource } from "../configs/connectDatabase";
import { User } from "../entitys/user.entity";

dotenv.config()

exports.verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { email } =req.method == "GET"? req.query : req.body;
        const exists = await myDataSource.getRepository(User).findOne({where: {email}});
        
        if(!exists) return res.status(404).send({ error: "Can't find User!"});
        next();

    } catch (err) {
        return res.status(404).send({ error: "Authentocation Error"})
    }
}

exports.requireAuth = (req:Request, res: Response, next: NextFunction) => {
    const token = req.cookies['refreshToken']
    if (token) {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY, (err, decodedToken)=>{
            if (err) {
                console.log(err.message);
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        console.log("else")
        next();
    }
}

exports.localVariables = (req: Request, res: Response, next: NextFunction) => {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next()
}