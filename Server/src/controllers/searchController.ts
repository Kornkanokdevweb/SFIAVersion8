import { Request, Response } from "express";
import { myDataSource } from "../configs/connectDatabase";
import { Skills } from "../entitys/skills.entity";

//ข้อมูลskillทั้งหมด
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
