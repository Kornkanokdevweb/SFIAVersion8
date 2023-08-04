// LoginValidation.ts
import Joi from "joi";

export const loginValidation = (data: any) => {
    const entity_user = Joi.object({
        email: Joi.string().min(6).required().email().messages({
            "string.email": `รูปแบบ E-mail ไม่ถูกต้อง`,
            "string.empty": `E-mail ไม่สามารถเป็นค่าว่างได้`,
            "string.min": `E-mail ต้องไม่ต่ำกว่า {#limit} ตัวอักษร`,
            "any.required": `จำเป็นต้องใส่ E-mail`,
        }),
        password: Joi.string().min(6).required().messages({
            "string.empty": `รหัสผ่านไม่สามารถเป็นค่าว่างได้`,
            "string.min": `รหัสผ่านต้องไม่ต่ำกว่า {#limit} ตัวอักษร`,
            "any.required": `จำเป็นต้องใส่รหัสผ่าน`,
        }),
    });
    return entity_user.validate(data)
}

export const registerValidation = (data: any) => {
    const entity_user = Joi.object({
        email: Joi.string().min(6).required().email().messages({
            "string.email": `รูปแบบ E-mail ไม่ถูกต้อง`,
            "string.empty": `E-mail ไม่สามารถเป็นค่าว่างได้`,
            "string.min": `E-mail ต้องไม่ต่ำกว่า {#limit} ตัวอักษร`,
            "any.required": `จำเป็นต้องใส่ E-mail`,
        }),
        password: Joi.string().min(6).required().messages({
            "string.empty": `รหัสผ่านไม่สามารถเป็นค่าว่างได้`,
            "string.min": `รหัสผ่านต้องไม่ต่ำกว่า {#limit} ตัวอักษร`,
            "any.required": `จำเป็นต้องใส่รหัสผ่าน`,
        }),
    });
    return entity_user.validate(data)
}