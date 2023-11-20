import { Request, Response } from "express";
import { Education } from "../entitys/education.entity";
import { Portfolio } from "../entitys/portfolio.entity";
import { myDataSource } from "../configs/connectDatabase";
import { getUserIdFromRefreshToken } from "../utils/authUtil";

//**POST Methods */
exports.createEducation = async (req: Request, res: Response) => {
    try {
        const userId = await getUserIdFromRefreshToken(req);
        
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const portfolio = await myDataSource
            .getRepository(Portfolio)
            .findOne({ where: { user: { id: userId } } });
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
        const userId = await getUserIdFromRefreshToken(req);
        
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }

        const portfolio = await myDataSource
            .getRepository(Portfolio)
            .findOne({ where: { user: { id: userId } } });

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
            education_id:education.id,
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
        const userId = await getUserIdFromRefreshToken(req);
        
        if (!userId) {
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
            .findOne({ where: { user: { id: userId } } });
        
        if (!portfolio) {
            return res.status(404).send({
                success: false,
                message: "Portfolio not found",
            });
        }
        
        const educationRepository = myDataSource.getRepository(Education);
        const deleteResult = await educationRepository.delete({ id: educationId, portfolio });
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
        const userId = await getUserIdFromRefreshToken(req);
        
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }

        const {
            education_id, 
            syear,
            eyear,
            level_edu,
            universe,
            faculty,
            branch,
        } = req.body;

        const educationRepository = myDataSource.getRepository(Education);

        const education = await educationRepository.findOne({
            where: { id: education_id , portfolio: { user: { id: userId } } },
        });
        
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
        await educationRepository.save(education);

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