const yup = require("yup");
const { ObjectId } = require("bson");

const objectIdValidator = yup
  .mixed()
  .test("objectId", "Invalid ObjectID", function (value) {
    if (value === undefined) {
      return true; // Ignorar validación si el valor es undefined
    }
    return ObjectId.isValid(value);
  });

module.exports = objectIdValidator;
