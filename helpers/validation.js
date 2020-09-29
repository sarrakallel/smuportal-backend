const Joi = require("@hapi/joi");

const handleJoiError = joiObject => {
  if (joiObject.error) {
    throw new Error(joiObject.error);
  }
};

const registerValidation = data => {
  const schema = Joi.object({
    firstName: Joi.string()
      .required()
      .min(2)
      .max(255)
      .lowercase()
      .pattern(/^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$/)
      .messages({
        "string.pattern.base": `"firstName" should contain characters and spaces only`
      }),
    lastName: Joi.string()
      .required()
      .min(2)
      .max(255)
      .lowercase()
      .pattern(/^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$/)
      .messages({
        "string.pattern.base": `"lastName" should contain characters and spaces only`
      }),
    universityID: Joi.number()
      .required()
      .integer()
      .min(1000000)
      .max(9999999),
    email: Joi.string()
      .required()
      .min(6)
      .max(255)
      .email()
      .pattern(
        new RegExp(
          "^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(" +
            process.env.EMAIL_DOMAINS +
            ")$"
        )
      )
      .messages({
        "string.pattern.base": `"email" domain name is not whitelisted`
      }),
    password: Joi.string()
      .required()
      .min(6)
      .max(1024)
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,1024}$/)
      .messages({
        "string.pattern.base": `"password" should contain at least 6 characters with one special character, one number and one uppercase letter`
      })
    /*role: Joi.string()
        .valid('student', 'professor')
        .messages({
            'any.only': `"role" is invalid`,
          }),
    enabled: Joi.bool()*/
  });

  return handleJoiError(schema.validate(data));
};

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email()
      .min(6)
      .max(255),
    password: Joi.string()
      .required()
      .min(6)
      .max(1024)
  });
  return handleJoiError(schema.validate(data));
};

const changePasswordValidation = data => {
  const schema = Joi.object({
    password: Joi.string()
      .required()
      .min(6)
      .max(1024)
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,1024}$/)
      .messages({
        "string.pattern.base": `"password" should contain at least 6 characters with one special character, one number and one uppercase letter`
      })
  });
  return handleJoiError(schema.validate(data));
};

module.exports = {
  registerValidation: registerValidation,
  loginValidation: loginValidation,
  changePasswordValidation: changePasswordValidation
};
