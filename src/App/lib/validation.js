// ES Module version of validation.js
import Joi from 'joi';

/**
 * Validate email request body
 * 
 * @param {object} data - Request body to validate
 * @returns {object} - Validation result with error or value
 */
export function validateEmailRequest(data) {
  const schema = Joi.object({
    recipients: Joi.object({
      to: Joi.array().items(Joi.string().email()).min(1).required(),
      cc: Joi.array().items(Joi.string().email()),
      bcc: Joi.array().items(Joi.string().email())
    }).required(),
    subject: Joi.string().required(),
    message: Joi.string().allow('', null),
    isTest: Joi.boolean().default(false),
    template: Joi.object({
      html: Joi.string().required(),
      json: Joi.any()
    }).required(),
    attachments: Joi.array().items(
      Joi.object({
        filename: Joi.string(),
        content: Joi.any(),
        path: Joi.string(),
        contentType: Joi.string()
      })
    )
  });

  return schema.validate(data);
}
