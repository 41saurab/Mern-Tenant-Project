import Joi from "joi";

export const userRegistrationDTO = Joi.object({
    fullName: Joi.string()
        .regex(/^([A-Za-z]+(?:\s[A-Za-z]+){1,2})$/)
        .required()
        .messages({
            "string.empty": "Full name is required.",
            "string.pattern.base": "Full name must contain at least a first name and last name, and can optionally include a middle name. Only letters are allowed.",
        }),
    phoneNumber: Joi.string()
        .regex(/^\+977-?(98\d{8})$/)
        .required()
        .messages({
            "string.pattern.base": "Phone number must follow the Nepali format, starting with +977 and followed by 10 digits (e.g., +9779801234567).",
        }),
    email: Joi.string().email().required().messages({
        "string.email": "A valid email address is required (e.g., example@domain.com).",
        "string.empty": "Email is required.",
    }),
    password: Joi.string()
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%&+-^])(?=.*[\d])[A-Za-z\d!@#$%&+-^]{8,25}$/)
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.pattern.base":
                "Password must be 8-25 characters long, containing at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !@#$%&+-^).",
        }),
    confirmPassword: Joi.string().equal(Joi.ref("password")).required().messages({
        "any.only": "Passwords do not match.",
        "string.empty": "Confirm password is required.",
    }),
    role: Joi.string().valid("admin", "tenant", "landlord").required().default("customer").messages({
        "string.empty": "Role is required.",
        "any.only": "Role must be one of the following: admin, tenant, or landlord.",
    }),
    gender: Joi.string().valid("male", "female", "other").required().messages({
        "string.empty": "Gender is required.",
        "any.only": "Gender must be one of the following: male, female, or other.",
    }),
});

export const userUpdateDTO = Joi.object({
    fullName: Joi.string()
        .regex(/^([A-Za-z]+(?:\s[A-Za-z]+){1,2})$/)
        .messages({
            "string.empty": "Full name is required.",
            "string.pattern.base": "Full name must contain at least a first name and last name, and can optionally include a middle name. Only letters are allowed.",
        }),
    phoneNumber: Joi.string()
        .regex(/^\+977-?(98\d{8})$/)
        .messages({
            "string.pattern.base": "Phone number must follow the Nepali format, starting with +977 and followed by 10 digits (e.g., +9779801234567).",
        }),
    email: Joi.string().email().messages({
        "string.email": "A valid email address is required (e.g., example@domain.com).",
        "string.empty": "Email is required.",
    }),
    oldPassword: Joi.string().when("password", {
        is: Joi.exist(),
        then: Joi.required().messages({
            "string.empty": "Old password is required when updating the password.",
        }),
    }),
    password: Joi.string()
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%&+-^])(?=.*[\d])[A-Za-z\d!@#$%&+-^]{8,25}$/)
        .messages({
            "string.pattern.base":
                "Password must be 8-25 characters long, containing at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !@#$%&+-^).",
        }),
}).unknown();

export const activationDTO = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().min(4).max(4).required(),
});

export const resendActivationDTO = Joi.object({
    email: Joi.string().email().required(),
});

export const loginDTO = Joi.object({
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
});
