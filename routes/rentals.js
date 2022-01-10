const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Student } = require("../models/student");
const upload = require("../middleware/upload");
const moment = require("moment");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", auth, async (req, res) => {
  const rentals = await Rental.find().select("-__v").sort("-dateOut");
  res.send(rentals);
});

router.post("/", [auth, upload.single("file")], async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const student = await Student.findById(req.body.studentId);
  if (!student) return res.status(400).send("Invalid student.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  let rental = new Rental({
    student: {
      _id: student._id,
      stuId: student.studentId,
      faculty: student.faculty,
      firstName: student.firstName,
      lastName: student.lastName,
    },
    status: "0",
    movie: {
      _id: movie._id,
      title: movie.title,
      bookCode: req.body.bookCode,
      author: movie.author,
    },
    rentalFee: movie.dailyRentalRate,
  });
  const tagResult = movie.tag.map((t) => {
    if (t.bookCode === req.body.bookCode) {
      t.status = "1";
    }
    return t;
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $set: { tag: tagResult },
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
});

router.post("/return/:id", [auth], async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(400).send("Invalid rental Id.");
  const bookCode = rental.movie.bookCode;
  const movieId = rental.movie._id;

  const movie = await Movie.findById(movieId);
  const tagResult = movie.tag.map((t) => {
    if (t.bookCode === bookCode) {
      t.status = "0";
    }
    return t;
  });
  try {
    new Fawn.Task()
      .update(
        "rentals",
        { _id: rental._id },
        {
          $set: { status: "2", dateReturned: Date.now },
        }
      )

      .update(
        "movies",
        { _id: movie._id },
        {
          $set: { tag: tagResult },
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  }

  // res.status(200).send(rental);
});

router.get("/:id", [auth], async (req, res) => {
  const rental = await Rental.findById(req.params.id).select("-__v");

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

// router.delete("/:id", [auth, admin], async (req, res) => {
//   const rental = await Rental.findByIdAndRemove(req.params.id);

//   if (!rental)
//     return res.status(404).send("The movie with the given ID was not found.");

//   res.send(rental);
// });

module.exports = router;
