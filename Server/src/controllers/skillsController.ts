import { Request, Response } from "express";
import { myDataSource } from "../configs/connectDatabase";
import { Skills } from "../entitys/skills.entity";
import { Levels } from "../entitys/levels.entity";
import { Datacollection } from "../entitys/datacollection.entity";
import { Information } from "../entitys/information.entity";
import { Description } from "../entitys/description.entity";
import { In, Not } from "typeorm";
import {
  findDatacollectionByUserId,
  findInformationByDatacollectionId,
  getUserIdFromRefreshToken,
} from "../utils/authUtil";

//ข้อมูลskillทั้งหมด
exports.searchSkills = async (req: Request, res: Response) => {
  try {
    const codeskill = req.query.codeskill;
    const levelName = req.query.level_name;
    const descid = req.query.descid; // เพิ่มการรับค่า descid

    const skillsRepository = myDataSource.getRepository(Skills);
    let skillsQuery = skillsRepository
      .createQueryBuilder("skill")
      .leftJoinAndSelect("skill.category", "category")
      .leftJoinAndSelect("category.subcategory", "subcategory")
      .leftJoinAndSelect("skill.levels", "level")
      .leftJoinAndSelect("level.descriptions", "descriptions");

    if (codeskill) {
      skillsQuery = skillsQuery.where({ codeskill });
    }

    if (levelName) {
      skillsQuery = skillsQuery.andWhere("level.level_name = :levelName", {
        levelName,
      });
    }

    if (descid) {
      skillsQuery = skillsQuery.andWhere("descriptions.descid = :descid", {
        descid,
      });
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

    let query = skillsRepository
      .createQueryBuilder("skill")
      .leftJoinAndSelect("skill.category", "category")
      .leftJoinAndSelect("category.subcategory", "subcategory")
      .leftJoinAndSelect("skill.levels", "level")
      .leftJoinAndSelect("level.descriptions", "descriptions");

    if (categoryText && subcategoryText) {
      query = query
        .where("category.category_text = :categoryText", { categoryText })
        .andWhere("subcategory.subcategory_text = :subcategoryText", {
          subcategoryText,
        });
    } else if (categoryText) {
      query = query.where("category.category_text = :categoryText", {
        categoryText,
      });
    }

    const skills = await query.getMany();

    // Extract subcategory_text from the result
    const subcategoryTexts = skills.map(
      (skill) => skill.category?.subcategory?.subcategory_text
    );

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
    const userId = await getUserIdFromRefreshToken(req);

    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthenticated",
      });
    }

    const descriptionId: any = req.query.descriptionId;
    const { info_text } = req.body; // รับ description id และ info_text จากข้อมูลที่ส่งมา

    if (!info_text) {
      return res.status(401).send({
        success: false,
        message: "info_text cannot be empty.",
      });
    }

    const datacollection: Datacollection = await findDatacollectionByUserId(
      userId
    );

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

    const { description_text: descriptionText } = description;

    const duplicateDescription = await myDataSource
      .getRepository(Description)
      .find({ where: { description_text: descriptionText } });

    //!! 903 is want tabSpace to find data//////////////
    if (duplicateDescription.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No duplicate descriptions found",
      });
    }

    const infoRepository = myDataSource.getRepository(Information);

    const duplicateDescriptionPromise = duplicateDescription.map(
      async (desc) => {
        const newInformation = await infoRepository.create({
          info_text,
          datacollection,
          description: desc,
        });
        return infoRepository.save(newInformation);
      }
    );

    const saveInformation = await Promise.all(duplicateDescriptionPromise);

    return res.status(200).send({
      success: true,
      message: "Record create success",
      datacollection,
      description,
      duplicateDescription: {
        totalOfDuplicateDescriptionText: duplicateDescription.length,
        dataOfDuplicateDescriptionText: duplicateDescription,
      },
      info_id: saveInformation.map((info) => info.id),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

// GET Method
exports.getDatacollection = async (req: Request, res: Response) => {
  try {
    const userId = await getUserIdFromRefreshToken(req);

    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthenticated",
      });
    }

    const datacollection: Datacollection = await findDatacollectionByUserId(
      userId
    );

    if (!datacollection) {
      return res.status(404).send({
        success: false,
        message: "Datacollection not found",
      });
    }
    const datacollectionId: string = datacollection.id.toString();

    const information = await findInformationByDatacollectionId(
      datacollectionId
    );

    if (!information) {
      return res.status(401).send({
        success: false,
        message: "Information not found for the given datacollection",
      });
    }

    const descriptionIds = information.map((info) => info.description.id);

    const descriptionRepository = myDataSource.getRepository(Description);

    const descriptionsWithLevel = await descriptionRepository.find({
      where: {
        id: In(descriptionIds),
      },
      relations: ["level"],
    });

    const levelsRepository = myDataSource.getRepository(Levels);

    const levelsData = await Promise.all(
      descriptionsWithLevel.map(async (description) => {
        const levelIdToSearch = description.level.id;
        const level = await levelsRepository.findOne({
          where: { id: levelIdToSearch },
        });

        const skillsRepository = myDataSource.getRepository(Skills);
        const uniqueSkills = await skillsRepository.find({
          relations: ["levels"],
          where: {
            levels: { id: levelIdToSearch },
          },
        });

        return {
          descriptionId: description.id,
          descriptionText: description.description_text,
          levelId: description.level.id,
          level,
          uniqueSkills,
        };
      })
    );

    return res.status(200).send({
      success: true,
      message: "Information found",
      datacollection,
      information, // เพิ่มข้อมูล information ในการคืนค่า
      descriptionsWithLevel: levelsData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// PUT Method
exports.updateDatacollection = async (req: Request, res: Response) => {
  try {
    const userId = await getUserIdFromRefreshToken(req);

    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthenticated",
      });
    }

    const informationId: any = req.query.informationId;
    const { info_text } = req.body; // รับ ID ของข้อมูล Information และค่า info_text ที่ต้องการอัปเดตจากข้อมูลที่ส่งมา

    const informationRepository = myDataSource.getRepository(Information);

    // ตรวจสอบว่าข้อมูล Information ที่ต้องการอัปเดตมีอยู่หรือไม่
    const information = await informationRepository.findOne({
      where: { id: informationId, datacollection: { user: { id: userId } } },
      relations: ["description"],
    });

    if (!information || !information.description) {
      return res.status(404).send({
        success: false,
        message: "Information not found",
      });
    }
    const { description_text: descriptionText } = information.description;

    const duplicateDescription = await myDataSource
      .getRepository(Description)
      .find({ where: { description_text: descriptionText } });

    //!! 903 is want tabSpace to find data//////////////
    if (duplicateDescription.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No duplicate descriptions found",
      });
    }

    // Update info_text in the current information
    information.info_text = info_text;
    await informationRepository.save(information);

    // Update info_text in other information with the same description_text
    const infoRepository = myDataSource.getRepository(Information);

    const updatePromises = duplicateDescription.map(async (desc) => {
      const otherInformation = await infoRepository.findOne({
        where: { description: desc },
      });

      if (otherInformation) {
        otherInformation.info_text = info_text;
        return infoRepository.save(otherInformation);
      }
    });

    await Promise.all(updatePromises);

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
};

// delete method
exports.deleteDatacollection = async (req: Request, res: Response) => {
  try {
    const userId = await getUserIdFromRefreshToken(req);

    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthenticated",
      });
    }

    const informationId: any = req.query.informationId; // รับ ID ของข้อมูล Information ที่ต้องการลบจากข้อมูลที่ส่งมา

    const informationRepository = myDataSource.getRepository(Information);

    // ตรวจสอบว่าข้อมูล Information ที่ต้องการลบมีอยู่หรือไม่
    const information = await informationRepository.findOne({
      where: { id: informationId, datacollection: { user: { id: userId } } },
      relations: ["description"],
    });

    if (!information || !information.description) {
      return res.status(404).send({
        success: false,
        message: "Information not found",
      });
    }

    const { description_text: descriptionText } = information.description;

    // Find other information with the same description_text
    const duplicateDescriptions = await myDataSource
      .getRepository(Description)
      .find({ where: { description_text: descriptionText } });
    
      if (duplicateDescriptions.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No duplicate descriptions found",
      });
    }
    
    // Delete the current information
    await informationRepository.remove(information);

    // Delete other information with the same description_text
    const infoRepository = myDataSource.getRepository(Information);

    const deletePromises = duplicateDescriptions.map(async (desc) => {
      const otherInformation = await infoRepository.findOne({
        where: { description: desc },
      });

      if (otherInformation) {
        return infoRepository.remove(otherInformation);
      }
    });

    await Promise.all(deletePromises);

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
};