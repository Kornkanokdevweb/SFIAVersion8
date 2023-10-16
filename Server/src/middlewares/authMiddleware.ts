import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { myDataSource } from "../configs/connectDatabase";
import { User } from "../entitys/user.entity";
import multer from "multer";

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
                // console.log(decodedToken);
                next();
            }
        })
    } else {
        return res.status(401).send({
            success: false,
            message: "กรุณาเข้าสู่ระบบ"
        })
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

const storage = multer.diskStorage({
    destination: function(req: Request, file, cb) {
        cb(null, '../Server/src/uploads')
    },
    filename: function(req: Request, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'profileImage-' + uniqueSuffix + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    // ตรวจสอบว่าไฟล์ที่อัปโหลดเป็นรูปภาพหรือไม่
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  };

exports.upload = multer({storage: storage, fileFilter: fileFilter}).single('file')