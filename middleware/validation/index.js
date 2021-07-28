const { body, validationResult } = require("express-validator");

const validate = (schemas) => {
  return async (req, res, next) => {
    await Promise.all(schemas.map((schema) => schema.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }
    const extractedErrors = [];
    result.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
      result: extractedErrors,
    });
  };
};

module.exports = {
  validate,
};
