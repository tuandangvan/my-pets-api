import Joi from "joi";

export default class Validate {
  static get registerValidation() {
    return Joi.object().keys({
      email: Joi.string().email().required().message({
        "string.empty": "Display name cannot be empty",
        "string.min": "Min 6 characteers",
        "any.only": "Must be a valid email address"
      }),
      password: Joi.string()
        .regex(/^@#$%&[a-zA-Z0-9]{8,30}$/)
        .required()
        .message({
          "string.empty": "Display name cannot be empty",
          "string.min": "Min 6 characteers",
          "any.only": "Password is required!"
        }),
      role: Joi.string()
        .valid("USER", "CENTER")
        .required()
        .message({ "any.only": "Only USER and CENTER are allowed" })
    });
  }
  static get userValidation() {
    return Joi.object().keys({
      firstName: Joi.string().alphanum().min(1).max(30).required(),
      lastName: Joi.string().alphanum().min(1).max(30).required(),
      phoneNumber: Joi.number().max(10).min(10).required(),
      address: Joi.string().required()
    });
  }
}

// }

// const registerValidation = async () =>{
//   return Joi.object().keys({
//     email: Joi.string().email().required(),
//     password: Joi.string()
//       .regex(/^@#$%&[a-zA-Z0-9]{8,30}$/)
//       .required(),
//     role: Joi.string()
//       .valid("USER", "CENTER")
//       .required()
//       .message({ erorr: "Only USER and CENTER are allowed" })
//   });
// };

// const userValidation = async () => {
//   return Joi.object().keys({
//     firstName: Joi.string().alphanum().min(1).max(30).required(),
//     lastName: Joi.string().alphanum().min(1).max(30).required(),
//     phoneNumber: Joi.number().max(10).min(10).required(),
//     address: Joi.string().required()
//   });
// };
// export const validate = {
//   registerValidation,
//   userValidation
// };
