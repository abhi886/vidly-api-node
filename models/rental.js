const Joi = require("joi");
const mongoose = require("mongoose");
const moment = require("moment");

const rentalSchema = new mongoose.Schema({
  student: {
    type: new mongoose.Schema({
      stuId: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      faculty: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
      },
      firstName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
      },
      lastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
      },
    }),
    required: true,
  },
  status: {
    type: Number,
    minlength: 1,
    maxlength: 1,
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      bookCode: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
      },
      author: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
    default: Date.now,
  },
  leaseEndDate: {
    type: Date,
    default: moment().add(30, "d"),
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

rentalSchema.statics.lookup = function (studentId, movieId) {
  return this.findOne({
    "student._id": studentId,
    "movie._id": movieId,
  });
};

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, "days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = {
    studentId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
    bookCode: Joi.required(),
  };

  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
