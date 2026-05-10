import Joi from 'joi';

export const productValidation = {
  create: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().min(0).required(),
    category: Joi.string().required(), // Expecting MongoDB ObjectId
    images: Joi.array().items(Joi.string().uri()).optional(),
  }),
  update: Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().min(10),
    price: Joi.number().positive(),
    stock: Joi.number().integer().min(0),
    category: Joi.string(),
    images: Joi.array().items(Joi.string().uri()),
  }).min(1),
};

export const categoryValidation = {
  create: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().optional(),
    slug: Joi.string().lowercase().required(),
  }),
};
