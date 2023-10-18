const Joi = require("@hapi/joi");

// Register Validate
const registerValidation = function (data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().required().min(10).max(10)
  });
  console.log(data)
  return schema.validate(data);
};
module.exports.registerValidation = registerValidation;
