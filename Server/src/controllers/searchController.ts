import { Request, Response } from "express";
import { Skills } from "../entitys/skills.entity";
import { myDataSource } from "../configs/connectDatabase";
import { Category } from "../entitys/category.entity";
import { Subcategory } from "../entitys/subcategory.entity";

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

exports.dropdownCategories = async (req: Request, res: Response) => {
  try {
    const category_text = req.params.category_text; // ดึงค่า category_text จากพารามิเตอร์

    const categoriesRepository = myDataSource.getRepository(Category);

    let categories;

    if (category_text) {
      // กรณีมีการระบุ category_text ใน URL
      categories = await categoriesRepository.find({
        relations: ["subcategory", "skill"],
        where: { category_text },
      });
    } else {
      // กรณีไม่มีการระบุ category_text ใน URL
      categories = await categoriesRepository.find({
        relations: ["subcategory", "skill"],
      });
    }

    const subcategoryTexts = categories.map(category => category.subcategory.subcategory_text);

    return res.send({ categories: categories, subcategories: subcategoryTexts });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.dropdownSubcategories = async (req: Request, res: Response) => {
  try {
    const categoryText = req.params.categoryText; // Get category_text from the URL parameter

    // Fetch subcategories based on the selected category_text
    const subcategories = await myDataSource.getRepository(Subcategory).createQueryBuilder("sub")
      .innerJoin("sub.categories", "cat", "cat.category_text = :categoryText", { categoryText })
      .getMany();

    return res.send({ subcategories: subcategories });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};