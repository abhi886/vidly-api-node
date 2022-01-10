const Joi = require("joi");
const mongoose = require("mongoose");

const Student = mongoose.model(
  "Students",
  new mongoose.Schema({
    studentId: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 255,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    faculty: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 255,
    },
    studentImage: {
      type: String,
    },
  })
);

function validateStudent(student) {
  const schema = {
    studentId: Joi.string().min(2).max(50).required(),
    firstName: Joi.string().min(5).max(50).required(),
    lastName: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required(),
    faculty: Joi.string().min(2).max(50).required(),
    studentImage: Joi.string(),
  };

  return Joi.validate(student, schema);
}

exports.Student = Student;
exports.validate = validateStudent;
