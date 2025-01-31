import Joi from "joi";

export const reviewCreateDTO = Joi.object({
    landlordId: Joi.string().required(),
    rate: Joi.number().min(0).max(5).required(),
    review: Joi.string().min(3).max(500).optional().default(null),
}).unknown();
