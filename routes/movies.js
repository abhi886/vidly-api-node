const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var multer = require("multer");
var cors = require("cors");
router.get("/", async (req, res) => {
  const movies = await Movie.find().select("-__v").sort("-createdDate");
  res.send(movies);
});

router.post("/", [auth, admin, upload.single("file")], async (req, res) => {
  console.log("reached here POST");
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");
  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    bookCode: req.body.bookCode,
    author: req.body.author,
    // tag: JSON.parse(req.body.tag),
    publishDate: moment().toJSON(),
  });
  if (req.file) {
    movie.bookImage = req.file.path;
  }
  const tempTag = JSON.parse(req.body.tag).map((t) => ({
    bookCode: t,
    status: "0",
  }));
  movie.tag = tempTag;
  if (!req.file) {
    movie.bookImage = "";
  }
  await movie.save();
  res.send(movie);
});

router.put("/:id", [auth, admin, upload.single("file")], async (req, res) => {
  console.log("reached here at PUT method");
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const data = {
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    bookCode: req.body.bookCode,
    author: req.body.author,
    // tag: JSON.parse(req.body.tag),
  };
  const tempTag = JSON.parse(req.body.tag).map((t) => ({
    bookCode: t,
    status: "0",
  }));
  data.tag = tempTag;

  req.file ? (data.bookImage = req.file.path) : " ";
  const movie = await Movie.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const movie = await Movie.findById(req.params.id).select("-__v");

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
