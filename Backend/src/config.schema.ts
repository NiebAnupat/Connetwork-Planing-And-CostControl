import Joi from "@hapi/joi";

export const configValidationSchema = Joi.object({
    MONGO_URI: Joi.string().required(),
    SECRET_KEY: Joi.string().required(),
    PROJECT_ID: Joi.string().required(),
    PRIVATE_KEY: Joi.string().required(),
    CLIENT_EMAIL: Joi.string().required(),
    STORAGE_MEDIA_BUCKET: Joi.string().required(),
})
