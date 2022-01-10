const { array } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const moment = require("moment");

const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    tag: [],
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    bookCode: {
      type: String,
      minlength: 2,
      maxlength: 255,
    },
    author: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 255,
    },
    bookImage: {
      type: String,
    },
    createdDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  })
);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
    bookCode: Joi.string().min(2).max(50),
    author: Joi.string().min(2).max(50),
    tag: Joi.array().items(Joi.string()),
    bookImage: Joi.string(),
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
