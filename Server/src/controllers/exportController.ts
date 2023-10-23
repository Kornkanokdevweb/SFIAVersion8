import { Request, Response } from "express";
import { myDataSource } from "../configs/connectDatabase";
import { getUserIdFromRefreshToken } from "../utils/authUtil";

import { Portfolio } from "../entitys/portfolio.entity";
import { User } from "../entitys/user.entity";
import { Education } from '../entitys/education.entity';
import { Experience } from "../entitys/experience.entity";
import { Link } from "../entitys/link.entity";

//**GET Methods */
exports.getExportPortfolio = async (req: Request, res: Response) => {
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

        // Fetch the user based on the provided user ID
        const user = await myDataSource
            .getRepository(User)
            .findOne({ where: { id: userId } });

        // Get education data
        const educationData = await myDataSource
            .getRepository(Education)
            .find({ where: { portfolio: portfolio } });

        // Get experience data
        const experienceData = await myDataSource
            .getRepository(Experience)
            .find({ where: { portfolio: portfolio } });

        // Get link data
        const linkData = await myDataSource
            .getRepository(Link)
            .find({ where: { portfolio: portfolio } });

        const users = {
            id: user.id,
            email: user.email,
            line: user.line,
            phone: user.phone,
            profileImage: user.profileImage,
            firstNameTH: user.firstNameTH,
            lastNameTH: user.lastNameTH,
            firstNameEN: user.firstNameEN,
            lastNameEN: user.lastNameEN,
            address: user.address,
        };

        const education = educationData.map((education) => ({
            education_id: education.id,
            syear: education.syear,
            eyear: education.eyear,
            level_edu: education.level_edu,
            universe: education.universe,
            faculty: education.faculty,
            branch: education.branch,
        }));

        const experience = experienceData.map((experience) => ({
            exp_id: experience.id,
            exp_text: experience.exp_text,
        }))

        const link = linkData.map((link) => ({
            link_id: link.id,
            link_name: link.link_name,
            link_text: link.link_text,
        }))

        return res.status(200).json({
            success: true,
            data: { users, education, experience, link }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Server error",
        });
    }
}
