const Joi = require("joi");
const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
});

const Faculty = mongoose.model("Faculty", facultySchema);

function validateFaculty(faculty) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
  };

  return Joi.validate(faculty, schema);
}

exports.facultySchema = facultySchema;
exports.Faculty = Faculty;
exports.validate = validateFaculty;
