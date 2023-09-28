import { Request, Response } from "express";
import { Link } from "../entitys/link.entity";
import { Portfolio } from "../entitys/portfolio.entity";
import { myDataSource } from "../configs/connectDatabase";
import jwt from "jsonwebtoken";

//**POST Methods */
exports.createLink = async (req: Request, res: Response) => {
    try{
        const refreshToken = req.cookies["refreshToken"];
        const verifyToken: any = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET_KEY
        );
        if (!verifyToken) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const portfolio = await myDataSource
            .getRepository(Portfolio)
            .findOne({ where: { user: { id: verifyToken.id } } });
        if (!portfolio) {
            return res.status(404).send({
                success: false,
                message: "Portfolio not found",
            });
        }
        const {
            link_name,
            link_text
        } = req.body;
        const linkRepository = myDataSource.getRepository(Link);
        const newLink = linkRepository.create({
            link_name,
            link_text,
            portfolio: portfolio, //เพิ่ม portfolioId ในบันทึก Link
        });
        await linkRepository.save(newLink);
        return res.status(200).send({
            success: true,
            message: "Record create success",
            portfolio: portfolio,
        });
    }catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Server error",
        });
    }
}

//**GET Methods */
exports.getLink = async (req: Request, res: Response) => {
    try{
        const refreshToken = req.cookies["refreshToken"];
        const verifyToken: any = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET_KEY
        );
        if(!verifyToken) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const portfolio = await myDataSource
            .getRepository(Portfolio)
            .findOne({ where: { user: { id: verifyToken.id } } });

        if(!portfolio) {
            return res.status(404).send({
                success: false,
                message: "Portfolio not found",
            });
        }
        const linkData = await myDataSource
            .getRepository(Link)
            .find({ where: { portfolio: portfolio}})

        const linkList = linkData.map((link) => ({
            link_id: link.id,
            link_name: link.link_name,
            link_text: link.link_text,
        }));

        return res.status(200).json({
            success: true,
            data: linkList,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

//**PUT Methods*/
exports.updateLink = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies["refreshToken"];
        const verifyToken: any = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET_KEY
        );
        if (!verifyToken) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }

        const userId = verifyToken.id; // รับ user id จาก token
        const { linkId, link_name, link_text } = req.body; // รับ ID ของลิงก์และค่า link_name, link_text ที่ต้องการอัปเดตจากข้อมูลที่ส่งมา

        const linkRepository = myDataSource.getRepository(Link);

        // ตรวจสอบว่าลิงก์ที่ต้องการอัปเดตมีอยู่หรือไม่
        const link = await linkRepository.findOne({
            where: { id: linkId, portfolio: { user: { id: userId } } },
        });

        if (!link) {
            return res.status(404).send({
                success: false,
                message: "Link not found",
            });
        }

        // ทำการอัปเดตค่า link_name และ link_text
        link.link_name = link_name;
        link.link_text = link_text;
        await linkRepository.save(link);

        return res.status(200).send({
            success: true,
            message: "Record update success",
            link,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Server error",
        });
    }
}



//**DELETE Methods */
exports.deleteLink = async (req, res) => {
    try{
        const refreshToken = req.cookies["refreshToken"];
        const verifyToken: any = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET_KEY
        );
        if (!verifyToken) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const linkId = req.query.link_id;
        if (!linkId) {
            return res.status(400).send({
                success: false,
                message: "Missing link_id parameter",
            });
        }

        const portfolio = await myDataSource
            .getRepository(Portfolio)
            .findOne({ where: { user: { id: verifyToken.id } } });

        if (!portfolio) {
            return res.status(404).send({
                success: false,
                message: "Portfolio not found",
            });
        }
        const linkRepository = myDataSource.getRepository(Link);
        const deleteResult = await linkRepository.delete({ id: linkId, portfolio});
        if(deleteResult.affected === 0) {
            return res.status(404).send({
                success: false,
                message: "No link record found to delete",
            })
        }
        return res.status(200).send({
            success: true,
            message: "Link record deleted successfully",
        });
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: "Server error",
        })
    }
}