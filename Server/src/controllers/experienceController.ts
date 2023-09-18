import { Request, Response } from "express";
import { Experience } from "../entitys/experience.entity";
import { Portfolio } from "../entitys/portfolio.entity";
import { myDataSource } from "../configs/connectDatabase";
import jwt from "jsonwebtoken";

//**POST Methods */
exports.createExperience = async (req: Request, res: Response) => {
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
            exp_text
        } = req.body;
        const experienceRepository = myDataSource.getRepository(Experience);
        const newExperience = experienceRepository.create({
            exp_text,
            portfolio: portfolio, //เพิ่ม portfolioId ในบันทึก Experience
        });
        await experienceRepository.save(newExperience);
        return res.status(200).send({
            success: true,
            message: "Record create success",
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

//**GET Methods */
exports.getExperience = async (req: Request, res: Response) => {
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
        const portfolio = await myDataSource
            .getRepository(Portfolio)
            .findOne({ where: { user: { id: verifyToken.id } } });
        if (!portfolio) {
            return res.status(404).send({
                success: false,
                message: "Portfolio not found",
            });
        }

        const experienceData = await myDataSource
            .getRepository(Experience)
            .find({ where: { portfolio: portfolio } })

        const experienceList = experienceData.map((experience) => ({
            exp_text: experience.exp_text,
        }));

        return res.status(200).json({
            success: true,
            data: experienceList,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Server error",
        });
    }
}

//**PUT Methods*/
exports.updateExperience = async (req: Request, res: Response) => {
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
        const portfolio = await myDataSource
            .getRepository(Portfolio)
            .findOne({ where: { user: { id: verifyToken.id } } });
        if (!portfolio) {
            return res.status(404).send({
                success: false,
                message: "Portfolio not found",
            });
        }

        const { exp_text } = req.body;

        const expId = typeof req.query.exp_id === 'string'
            ? req.query.exp_id
            : '';

        const experience = await myDataSource
            .getRepository(Experience)
            .findOne({ where: { exp_id: expId, portfolio } })

        if (!experience) {
            return res.status(404).send({
                success: false,
                message: "Experience record not found",
            });
        }

        experience.exp_text = exp_text;

        await myDataSource.getRepository(Experience).save(experience);
        return res.status(200).json({
            success: true,
            message: "Experience record updated successfully",
            experience: experience,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

//**DELETE Methods */
exports.deleteExperience = async (req, res) => {
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
        const expId = req.query.exp_id;
        if (!expId) {
            return res.status(400).send({
                success: false,
                message: "Missing exp_id parameter",
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
        const experienceRepository = myDataSource.getRepository(Experience);
        const deleteResult = await experienceRepository.delete({ exp_id: expId, portfolio });
        if (deleteResult.affected === 0) {
            return res.status(404).send({
                success: false,
                message: "No experience record found to delete",
            })
        }
        return res.status(200).send({
            success: true,
            message: "experience record deleted successfully",
        });
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: "Server error",
        })
    }
}