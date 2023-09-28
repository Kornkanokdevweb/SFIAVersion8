import { Request, Response } from "express";
import { myDataSource } from "../configs/connectDatabase";
import jwt from "jsonwebtoken";
import { Skills } from "../entitys/skills.entity";
import { Datacollection } from "../entitys/datacollection.entity";
import { Information } from "../entitys/information.entity";
import { Description } from "../entitys/description.entity";
import { Levels } from "../entitys/levels.entity"

//ข้อมูลskillทั้งหมด
exports.searchSkills = async (req: Request, res: Response) => {
    try {
        const codeskill = req.query.codeskill;
        const levelName = req.query.level_name;
        const description = req.query.id;

        const skillsRepository = myDataSource.getRepository(Skills);
        let skillsQuery = skillsRepository.createQueryBuilder('skill')
            .leftJoinAndSelect('skill.category', 'category')
            .leftJoinAndSelect('category.subcategory', 'subcategory')
            .leftJoinAndSelect('skill.levels', 'level')
            .leftJoinAndSelect('level.descriptions', 'descriptions');

        if (codeskill) {
            skillsQuery = skillsQuery.where({ codeskill });
        }

        if (levelName) {
            skillsQuery = skillsQuery.andWhere('level.level_name = :levelName', { levelName });
        }

        const skills = await skillsQuery.getMany();

        if (skills.length === 0) {
            return res.status(404).send("No skills found");
        }

        return res.send(skills);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error");
    }
};

//การค้นหาข้อมูลแบบ dropdown
exports.dropdownSkillsAPI = async (req: Request, res: Response) => {
    try {
        const categoryText = req.query.categoryText; // Get category_text from query parameter
        const subcategoryText = req.query.subcategoryText; // Get category_text from query parameter
        const skillsRepository = myDataSource.getRepository(Skills); // Use getRepository function

        let query = skillsRepository.createQueryBuilder('skill')
            .leftJoinAndSelect('skill.category', 'category')
            .leftJoinAndSelect('category.subcategory', 'subcategory')
            .leftJoinAndSelect('skill.levels', 'level')
            .leftJoinAndSelect('level.descriptions', 'descriptions');

        if (categoryText && subcategoryText) {
            query = query
                .where('category.category_text = :categoryText', { categoryText })
                .andWhere('subcategory.subcategory_text = :subcategoryText', { subcategoryText });
        } else if (categoryText) {
            query = query.where('category.category_text = :categoryText', { categoryText });
        }

        const skills = await query.getMany();

        // Extract subcategory_text from the result
        const subcategoryTexts = skills.map((skill) => skill.category?.subcategory?.subcategory_text);

        return res.send({ skills, subcategoryTexts });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error"); // Send appropriate response in case of an error
    }
};


// API Datacollection
// Post Method
exports.createDatacollection = async (req: Request, res: Response) => {
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

        const { descriptionId, info_text } = req.body; // รับ description id และ info_text จากข้อมูลที่ส่งมา

        const datacollection = await myDataSource
            .getRepository(Datacollection)
            .findOne({ where: { user: { id: userId } } });

        if (!datacollection) {
            return res.status(404).send({
                success: false,
                message: "Datacollection not found",
            });
        }

        const description = await myDataSource
            .getRepository(Description)
            .findOne({ where: { id: descriptionId } }); // ค้นหา description ด้วย descriptionId ที่รับมา

        if (!description) {
            return res.status(404).send({
                success: false,
                message: "Description not found",
            });
        }
        const infoRepository = myDataSource.getRepository(Information);
        const newInformation = infoRepository.create({
            info_text,
            datacollection,
            description, // เพิ่ม description เข้าไปในข้อมูล
        });
        await infoRepository.save(newInformation);

        return res.status(200).send({
            success: true,
            message: "Record create success",
            datacollection,
            description,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Server error",
        });
    }
}

// GET Method
exports.getDatacollection = async (req: Request, res: Response) => {
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

        const datacollection = await myDataSource
            .getRepository(Datacollection)
            .findOne({ where: { user: { id: userId } } })
        console.log(datacollection)

        const descriptionId = req.body.descriptionId
        if (!descriptionId || descriptionId.length === 0) {
            return res.status(404).send({
                success: false,
                message: "DescriptionId not found",
            });
        }
        
        // ค้นหาข้อมูลในตาราง Information โดยใช้ descriptionId เป็นเงื่อนไข
        const information = await myDataSource
            .getRepository(Information)
            .find({ where:{ datacollection: { id: datacollection.id }, description: { id: descriptionId } } });

        if (!information || information.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Information not found for the given descriptionId",
            });
        }

        const skillsRepository = myDataSource.getRepository(Skills);
        const skillData = await skillsRepository
            .createQueryBuilder('skill')
            .leftJoinAndSelect('skill.category', 'category')
            .leftJoinAndSelect('category.subcategory', 'subcategory')
            .leftJoinAndSelect('skill.levels', 'level')
            .leftJoinAndSelect('level.descriptions', 'descriptions')
            .where('descriptions.id = :descriptionId', { descriptionId }) // เพิ่มเงื่อนไข descriptionId
            .getOne();
        if (!skillData) {
            return res.status(404).send({
                success: false,
                message: "Skill data not found for the given descriptionId",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Information found",
            information,
            descriptionId,
            skill: skillData,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Server error",
        });
    }
}

// PUT Method
exports.updateDatacollection = async (req: Request, res: Response) => {
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
        const { informationId, info_text } = req.body; // รับ ID ของข้อมูล Information และค่า info_text ที่ต้องการอัปเดตจากข้อมูลที่ส่งมา

        const informationRepository = myDataSource.getRepository(Information);

        // ตรวจสอบว่าข้อมูล Information ที่ต้องการอัปเดตมีอยู่หรือไม่
        const information = await informationRepository.findOne({
            where: { id: informationId, datacollection: { user: { id: userId } } },
        });

        if (!information) {
            return res.status(404).send({
                success: false,
                message: "Information not found",
            });
        }

        // ทำการอัปเดตค่า info_text
        information.info_text = info_text;
        await informationRepository.save(information);

        return res.status(200).send({
            success: true,
            message: "Record update success",
            information,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Server error",
        });
    }
}

// delete method
exports.deleteDatacollection = async (req: Request, res: Response) => {
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
        const { informationId } = req.body; // รับ ID ของข้อมูล Information ที่ต้องการลบจากข้อมูลที่ส่งมา

        const informationRepository = myDataSource.getRepository(Information);

        // ตรวจสอบว่าข้อมูล Information ที่ต้องการลบมีอยู่หรือไม่
        const information = await informationRepository.findOne({
            where: { id: informationId, datacollection: { user: { id: userId } } },
        });

        if (!information) {
            return res.status(404).send({
                success: false,
                message: "Information not found",
            });
        }

        // ลบข้อมูล Information
        await informationRepository.remove(information);

        return res.status(200).send({
            success: true,
            message: "Record deleted successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Server error",
        });
    }
}


