import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import { Request, Response } from "express";
import { Information } from "../entitys/information.entity";
import { Datacollection } from "../entitys/datacollection.entity";
import { myDataSource } from "../configs/connectDatabase";
import jwt from "jsonwebtoken";

export const hashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  return newPassword;
};

export const matchPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateOTP = () => {
  return otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

export const getUserIdFromRefreshToken = async function (req: Request): Promise<string | null> {
  const refreshToken = req.cookies["refreshToken"];
  const verifyToken: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
  );
  return verifyToken ? verifyToken.id : null;
}

export const findDatacollectionByUserId = async function (userId: string): Promise<Datacollection | null> {
  return await myDataSource
      .getRepository(Datacollection)
      .findOne({ where: { user: { id: userId } } });
}

export const findInformationByDatacollectionId = async function (datacollectionId: string): Promise<Information[]> {
  const datacollectionIdNumber: number = parseInt(datacollectionId, 10); // แปลงเป็น number
  return await myDataSource
      .getRepository(Information)
      .find({
          where: { datacollection: { id: datacollectionIdNumber } },
          relations: ['description'],
      });
}