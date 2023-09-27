import { Request, Response } from "express";
import { myDataSource } from "../configs/connectDatabase";
import { Skills } from "../entitys/skills.entity";
import jwt from "jsonwebtoken";
import { Datacollection } from "../entitys/datacollection.entity";
import { Information } from "../entitys/information.entity";
import { Description } from "../entitys/description.entity";

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

