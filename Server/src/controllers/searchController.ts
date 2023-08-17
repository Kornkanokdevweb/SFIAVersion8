import { Request, Response } from "express";
import { Skills } from "../entitys/skills.entity";
import { myDataSource } from "../configs/connectDatabase";

//การค้นหาข้อมูลskill
exports.searchSkills = async (req: Request, res: Response) => {
    try {
        const skillsRepository = myDataSource.getRepository(Skills); // Use getRepository function
        const skills = await skillsRepository.createQueryBuilder('skill')
            .leftJoinAndSelect('skill.category', 'category')
            .leftJoinAndSelect('category.subcategory', 'subcategory')
            .leftJoinAndSelect('skill.levels', 'level')
            .leftJoinAndSelect('level.descriptions', 'descriptions')
            .getMany();

        return res.send(skills);

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error"); // Send appropriate response in case of an error
    }
};

//การค้นหาแบบเฉพาะเจาะจง โดยใช้ codeskill
exports.listSkill = async (req: Request, res: Response) => {
    try {
        const codeskill = req.params.codeskill;
        const skillsRepository = myDataSource.getRepository(Skills); // Use getRepository function
        const skill = await skillsRepository.createQueryBuilder('skill')
            .where({ codeskill })
            .leftJoinAndSelect('skill.category', 'category')
            .leftJoinAndSelect('category.subcategory', 'subcategory')
            .leftJoinAndSelect('skill.levels', 'level')
            .leftJoinAndSelect('level.descriptions', 'descriptions')
            .getOne();
        
        if (!skill) {
            return res.status(404).send("Skill not found");
        }
        
        return res.send(skill);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error"); // Send appropriate response in case of an error
    }
};


