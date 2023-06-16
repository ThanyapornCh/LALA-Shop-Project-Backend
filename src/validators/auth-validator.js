const Joi = require('joi');
const validate = require('./validate');

const registerSchema = Joi.object({
  firstName: Joi.string().trim().required().messages({
    'string.empty': 'first name is required',
  }),
  lastName: Joi.string().trim().required().messages({
    'string.empty': 'last name is required',
  }),
  email: Joi.string()
    .valid()
    .email({ minDomainSegments: 1, tlds: { allow: ['com'] } })
    .required()
    .messages({
      'any.only': ' must be a valid email address',
      'string.empty': 'email is required',
    }),
  password: Joi.string().alphanum().min(6).required().trim().messages({
    'string.empty': 'password is required',
    'string.alphanum': 'password  must contain number or alphabet',
    'string.min': 'password must have at least 6 characters',
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .trim()
    .messages({
      'any.only': 'password and confirm password did not match ',
      'string.empty': 'confirm password is required',
    }),
});

exports.validateRegister = validate(registerSchema);

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

exports.validateLogin = validate(loginSchema);
