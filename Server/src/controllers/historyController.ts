import { Request, Response } from "express";
import { findDatacollectionByUserId, findInformationByDatacollectionId, getUserIdFromRefreshToken } from "../utils/authUtil";
import { Datacollection } from "../entitys/datacollection.entity";
import { myDataSource } from "../configs/connectDatabase";
import { Description } from "../entitys/description.entity";
import { In } from "typeorm";
import { Levels } from "../entitys/levels.entity";
import { Skills } from "../entitys/skills.entity";

exports.getHistory =async (req: Request, res: Response) => {
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
          information,
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