import Joi from "joi";

export const roomCreateDTO = Joi.object({
    title: Joi.string().min(3).required(),
    status: Joi.string()
        .regex(/^(available|unavailable)$/)
        .default("available"),
    rentPrice: Joi.number().min(4000).required(),
    location: Joi.string().required(),
    description: Joi.string().optional().default(null),
}).unknown();

export const roomUpdateDTO = Joi.object({
    title: Joi.string().min(3),
    status: Joi.string()
        .regex(/^(available|unavailable)$/)
        .default("available"),
    rentPrice: Joi.number().min(4000),
    location: Joi.string(),
    description: Joi.string().optional().default(null),
}).unknown();
