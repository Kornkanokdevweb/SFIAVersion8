import { Request, Response } from "express";
import { Education } from "../entitys/education.entity";
import { Portfolio } from "../entitys/portfolio.entity";
import { User } from "../entitys/user.entity";
import { myDataSource } from "../configs/connectDatabase";
import jwt from "jsonwebtoken";

//**POST Methods */
exports.createEducation = async (req: Request, res: Response) => {
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
        const user = await myDataSource
            .getRepository(User)
            .findOne({ where: { id: verifyToken.id } });
        console.log(user)
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const portfolio = await myDataSource
            .getRepository(Portfolio)
            .findOne({ where: { user: { id: verifyToken.id } } });
        console.log(portfolio)
        if (!portfolio) {
            return res.status(404).send({
                success: false,
                message: "Portfolio not found",
            });
        }
        const {
            syear,
            eyear,
            level_edu,
            universe,
            faculty,
            branch,
        } = req.body;
        const educationRepository = myDataSource.getRepository(Education);
        const newEducation = educationRepository.create({
            syear,
            eyear,
            level_edu,
            universe,
            faculty,
            branch,
            portfolio: portfolio, // เพิ่ม portfolioId ในบันทึก Education
        });
        await educationRepository.save(newEducation);
        return res.status(200).send({
            success: true,
            message: "Record update success",
            user: user,
            portfolio: portfolio,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Server error",
        });
    }
}

//**GET Methods*/
exports.getEducation = async (req: Request, res: Response) => {
    try {
        // ดึงข้อมูล userId จาก refreshToken และหา portfolio ของผู้ใช้
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

        // ดึงข้อมูลการศึกษาของผู้ใช้จากตาราง "education"
        const educationData = await myDataSource
            .getRepository(Education)
            .find({ where: { portfolio: portfolio } });

        // สร้าง array เพื่อเก็บข้อมูลการศึกษาที่จะส่งกลับ
        const educationList = educationData.map((education) => ({
            education_id:education.education_id,
            syear: education.syear,
            eyear: education.eyear,
            level_edu: education.level_edu,
            universe: education.universe,
            faculty: education.faculty,
            branch: education.branch,
        }));

        return res.status(200).json({
            success: true,
            data: educationList,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

//**DELETE Methods */
exports.deleteEducation = async (req, res) => {
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
        
        const educationId = req.query.education_id; // รับ education_id จาก query
        if (!educationId) {
            return res.status(400).send({
                success: false,
                message: "Missing education_id parameter",
            });
        }
        
        // Find the user's portfolio
        const portfolio = await myDataSource
            .getRepository(Portfolio)
            .findOne({ where: { user: { id: verifyToken.id } } });
        
        if (!portfolio) {
            return res.status(404).send({
                success: false,
                message: "Portfolio not found",
            });
        }
        
        const educationRepository = myDataSource.getRepository(Education);
        const deleteResult = await educationRepository.delete({ education_id: educationId, portfolio });
        if (deleteResult.affected === 0) {
            return res.status(404).send({
                success: false,
                message: "No education record found to delete",
            });
        }
        
        return res.status(200).send({
            success: true,
            message: "Education record deleted successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Server error",
        });
    }
};

//**PUT Methods */
exports.updateEducation = async (req: Request, res: Response) => {
    try {
        // Extract user ID from the refreshToken
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

        // Find the user's portfolio
        const portfolio = await myDataSource
            .getRepository(Portfolio)
            .findOne({ where: { user: { id: verifyToken.id } } });

        if (!portfolio) {
            return res.status(404).send({
                success: false,
                message: "Portfolio not found",
            });
        }

        // Extract education data from the request body
        const {
            syear,
            eyear,
            level_edu,
            universe,
            faculty,
            branch,
        } = req.body;

        // Extract education_id from the URL params
        const educationId = typeof req.query.education_id === 'string'
            ? req.query.education_id
            : '';

        // Find the specific education record associated with educationId
        const education = await myDataSource
            .getRepository(Education)
            .findOne({ where: { education_id: educationId, portfolio } });

        if (!education) {
            return res.status(404).send({
                success: false,
                message: "Education record not found",
            });
        }

        // Update the education record with the new data
        education.syear = syear;
        education.eyear = eyear;
        education.level_edu = level_edu;
        education.universe = universe;
        education.faculty = faculty;
        education.branch = branch;

        // Save the updated education record
        await myDataSource.getRepository(Education).save(education);

        return res.status(200).json({
            success: true,
            message: "Education record updated successfully",
            education: education,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};