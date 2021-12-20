const Joi = require('joi');

const validateAuth = (condition) => {
  return async (req, res, next) => {
    try {
      await condition.validateAsync(req.body, {
        abortEarly: false,
      });

      next();
    } catch (error) {
      const errors = {};
      for (let item of error.details) {
        errors[item.path[0]] = item.message;
      }
      return res.status(400).json({
        status: 'fail',
        message: errors,
      });
    }
  };
};

const conditionSignup = Joi.object({
  email: Joi.string().trim().required().email(),
  password: Joi.string().trim().required().min(6).max(160),
  passwordConfirm: Joi.string()
    .required()
    .trim()
    .min(6)
    .max(160)
    .valid(Joi.ref('password')),
  fullName: Joi.string().trim().required().min(3).max(30),
});

const conditionLogin = Joi.object({
  email: Joi.string().trim().required().email(),
  password: Joi.string().trim().required().min(6).max(160),
});

const conditionForgotPassword = Joi.object({
  email: Joi.string().trim().required().email(),
});

const conditionResetPassword = Joi.object({
  password: Joi.string().trim().required().min(6).max(160),
  passwordConfirm: Joi.string()
    .required()
    .trim()
    .min(6)
    .max(160)
    .valid(Joi.ref('password')),
});

const validateSignup = validateAuth(conditionSignup);
const validateLogin = validateAuth(conditionLogin);
const validateForgotPassword = validateAuth(conditionForgotPassword);
const validateResetPassword = validateAuth(conditionResetPassword);

module.exports = {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};

// const validateSignup = async (req, res, next) => {
//   const conditionSignup = Joi.object({
//     email: Joi.string().trim().required().email(),
//     password: Joi.string().trim().required().min(6).max(160),
//     passwordConfirm: Joi.string()
//       .required()
//       .trim()
//       .min(6)
//       .max(160)
//       .valid(Joi.ref('password')),
//     fullName: Joi.string().trim().required().alphanum().min(3).max(30),
//   });

//   try {
//     await conditionSignup.validateAsync(req.body, {
//       abortEarly: false,
//     });
//     next();
//   } catch (error) {
//     const errors = {};
//     for (let item of error.details) {
//       errors[item.path[0]] = item.message;
//     }
//     return res.status(400).json({
//       status: 'fail',
//       message: errors,
//     });
//   }
// };

// const validateLogin = async (req, res, next) => {
//   const conditionLogin = Joi.object({
//     email: Joi.string().trim().required().email(),
//     password: Joi.string().trim().required().min(6).max(160),
//   });

//   try {
//     await conditionLogin.validateAsync(req.body, {
//       abortEarly: false,
//     });
//     next();
//   } catch (error) {
//     const errors = {};
//     for (let item of error.details) {
//       errors[item.path[0]] = item.message;
//     }
//     return res.status(400).json({
//       status: 'fail',
//       message: errors,
//     });
//   }
// };
