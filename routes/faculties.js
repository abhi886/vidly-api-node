const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Faculty, validate } = require("../models/faculty");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const facultys = await Faculty.find().select("-__v").sort("name");
  res.send(facultys);
});

router.post("/", auth, async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let uniqueFaculty = await Faculty.findOne({ name: req.body.name });
  if (uniqueFaculty) return res.status(400).send("Faculty already exists.");

  let faculty = new Faculty({ name: req.body.name });
  faculty = await faculty.save();

  res.send(faculty);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const faculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!faculty)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(faculty);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  console.log(req.params);
  const faculty = await Faculty.findByIdAndRemove(req.params.id);

  if (!faculty)
    return res.status(404).send("The faculty with the given ID was not found.");

  res.send(faculty);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const faculty = await Faculty.findById(req.params.id).select("-__v");

  if (!faculty)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(faculty);
});

module.exports = router;
