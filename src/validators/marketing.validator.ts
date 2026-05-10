import Joi from 'joi';

export const newsletterValidation = {
  subscribe: Joi.object({
    email: Joi.string().email().required(),
  }),
};
