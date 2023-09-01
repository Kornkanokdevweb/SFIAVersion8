import { Request, Response } from "express";
import { User } from "../entitys/user.entity";
import { myDataSource } from "../configs/connectDatabase";
import { loginValidation, registerValidation } from "../utils/validation";
import { hashedPassword, matchPassword, generateOTP } from "../utils/authUtil";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Token } from "../entitys/token.entity";
import { MoreThanOrEqual } from "typeorm";
import fs from "fs";

dotenv.config();

/**POST http://localhost:8080/api/register  --> Under Test
  *  @param: {
  * "email": "example@mail.com",
  * "password": "example1234"
}
*/
exports.register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // registerValidation here
    const { error } = registerValidation({ email, password });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const userRepository = myDataSource.getRepository(User);
    const hashedPasswordValue = await hashedPassword(password);

    const newUser = userRepository.create({
      email,
      password: hashedPasswordValue,
    });
    await userRepository.save(newUser);

    res.status(200).json({
      success: true,
      message: 'Registration successful. Please log in.',
    });
  } catch (err) {
    // ตรวจสอบว่ามี email นี้ในระบบแล้วหรือไม่
    if (err.code != undefined && err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Email has already exists",
      });
    } else {
      res.status(500).send("Server Error");
    }
  }
};

/**POST http://localhost:8080/api/login  --> Under Test
  *  @param: {
  * "email": "example@mail.com",
  * "password": "example1234"
}
*/
exports.login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { error } = loginValidation({ email, password });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const userRepository = myDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "ไม่มีผู้ใช้ในระบบนี้" });
    }
    const validPass = await matchPassword(password, user.password);
    if (!validPass || !password)
      return res
        .status(400)
        .json({ success: false, message: "รหัสผ่านไม่ถูกต้อง" });

    const refreshToken = jwt.sign(
      {
          id: user.id,
      },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "1w" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, //7day
    });

    const expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 7);

    await myDataSource.getRepository(Token).save({
      user_id: user.id,
      token: refreshToken,
      expired_at,
    });

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: "30s" }
    );

    res.send({
      token,
    });
  } catch (err) {
    return res.status(500).send("Server Error");
  }
};

/**POST http://localhost:8080/api/logout  --> Under Test*/
exports.logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies['refreshToken'];

  await myDataSource.getRepository(Token).delete({ token: refreshToken });

  res.cookie('refreshToken', '', { maxAge: 0 });

  res.send({
    success: true,
    message: "Success",
  });
};

/**GET http://localhost:8080/api/authenticate&&getuserData  --> Under Test*/
exports.authenticateUser = async (req: Request, res: Response) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
      return res.status(401).send({
        success: false,
        message: "Unauthenticated",
      });
    }

    const accessToken = authorizationHeader.split(" ")[1];

    try {
      const verifyToken: any = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET_KEY
      );

      if (!verifyToken) {
        return res.status(401).send({
          success: false,
          message: "Unauthenticated",
        });
      }

      const user = await myDataSource
        .getRepository(User)
        .findOne({ where: { id: verifyToken.id } });

      if (!user) {
        return res.status(401).send({
          success: false,
          message: "Unauthenticated",
        });
      }

      const { password, ...data } = user;
      return res.send(data);
    } catch (err) {
      return res.status(401).send({
        success: false,
        message: "Unauthenticated",
      });
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**POST http://localhost:8080/api/refreshToken  --> Under Test*/
exports.refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies['refreshToken'];

    const payload: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );
    if (!payload) {
      return res.status(401).send({
        success: false,
        message: "Unauthenticated",
      });
    }

    const tokenStore = await myDataSource.getRepository(Token).findOne({
      where: {
        user_id: payload.id,
        expired_at: MoreThanOrEqual(new Date()),
      },
    });

    if (!tokenStore) {
      return res.status(401).send({
        success: false,
        message: "Unauthenticated",
      });
    }

    const token = jwt.sign(
      {
        id: payload.id,
      },
      process.env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: "30s" }
    );

    res.send({
      token,
    });
  } catch (err) {
    return res.status(401).send({
      success: false,
      message: "Unauthenticated",
    });
  }
};

/**PUT http://localhost:8080/api/updateUser  --> Under Test 
  * @param: {
  * "id": "<userid>"
  * }
  * body: {
  * firstNameTH: '',
  * lastNameTH: '',
  * firstNameEN: '',
  * lastNameEN: '',
  * phone: '',
  * line: '',
  * address: '',
}
*/
exports.updateUser = async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"];
  try {
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

    const user = await myDataSource
      .getRepository(User)
      .findOne({ where: { id: verifyToken.id } });

    if (!user) {
      return res.send(401).send({
        success: false,
        message: "Unauthenticated",
      });
    }

    //if user has pass authenticated
    if (req.file) {
      if (user.profileImage && user.profileImage !== 'noimage.jpg') { // เพิ่มเงื่อนไขในการตรวจสอบว่าไม่ใช่ 'noimage.jpg'
        try {
          fs.unlink('../Server/src/uploads/' + user.profileImage, (err) => {
            if (err) {
              console.log('Error deleting old profile image:', err);
            } else {
              console.log('Old profile image deleted');
            }
          });
        } catch (err) {
          console.error('Error deleting old profile image:', err);
        }
      }
      user.profileImage = req.file.filename;
    }
    
    const {
      firstNameTH,
      lastNameTH,
      firstNameEN,
      lastNameEN,
      phone,
      line,
      address,
    } = req.body;

    user.firstNameTH = firstNameTH;
    user.lastNameTH = lastNameTH;
    user.firstNameEN = firstNameEN;
    user.lastNameEN = lastNameEN;
    user.phone = phone;
    user.line = line;
    user.address = address;

    await myDataSource.getRepository(User).save(user);
    return res.status(200).send({
      success: true,
      message: "Record update success",
      user: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

/**GET http://localhost:8080/api/generateOTP  --> Under Test  */
exports.generateOTPHandler = async (req: Request, res: Response) => {
  try {
    const OTP = generateOTP();
    req.app.locals.OTP = OTP;

    res.status(201).json({ code: OTP });
  } catch (err) {
    res.status(500).json({
      suceess: false,
      message: "Failed to generate OTP. An internal server error occurred.",
    });
  }
};

/**GET http://localhost:8080/api/verifyOTP  --> Under Test  */
exports.verifyOTPHandler = async (req: Request, res: Response) => {
  const { code } = req.query;
  const otpFromLocal = parseInt(req.app.locals.OTP);

  if (!otpFromLocal) {
    return res.status(400).json({
      error: "OTP has not been generated. Please generate OTP first.",
    });
  }
  const enteredOTP = parseInt(code as string);

  if (enteredOTP === otpFromLocal) {
    req.app.locals.OTP = null; //reset the OTP value
    req.app.locals.resetSession = true; // start cookies for reset password
    return res.status(201).send({
      message: "Verify Success",
    });
  }

  return res.status(400).send({
    error: "Invalid OTP",
  });
};

//successfully redirect user when OTP is valid
/**GET http://localhost:8080/api/createResetSession  --> Under Test */
exports.createResetSession = async (req: Request, res: Response) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false; // allow accees to this route only once
    return res.status(201).send({ msg: "Access granted!" });
  }
  return res.status(440).send({ error: "Session has expired!" });
};

//update the password when we have valid session
/**GET http://localhost:8080/api/resetPassword  --> Under Test */
exports.resetPassword = async (req: Request, res: Response) => {
  try {
    if(!req.app.locals.resetSession) return res.status(404).send({ error: "Session has expired!"});

    const { email, password } = req.body;

    // Find the user by email
    const userRepository = myDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const hashedPass = await hashedPassword(password);
    
    if (!hashedPass) {
      return res.status(404).json({ error: "Enable to hashed password"})
    }

    // Update the user's password
    await userRepository.update({ email: user.email }, { password: hashedPass });

    return res.status(201).json({ msg: "Reset password success" });
  } catch (err) {
    return res.status(401).send({ err });
  }
};