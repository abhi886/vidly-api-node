const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");
const { Student, validate } = require("../models/student");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const students = await Student.find().select("-__v").sort("name");
  res.send(students);
});

router.post("/", [auth, admin, upload.single("file")], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const student = new Student({
    firstName: req.body.firstName,
    email: req.body.email,
    lastName: req.body.lastName,
    faculty: req.body.faculty,
    studentId: req.body.studentId,
  });
  if (req.file) {
    student.studentImage = req.file.path;
  }
  await student.save();

  res.send(student);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const student = await Student.findByIdAndRemove(req.params.id);

  if (!student)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(student);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const student = await Student.findById(req.params.id).select("-__v");

  if (!student)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(student);
});

router.post("/getInfo/:id", async (req, res) => {
  const student = await Student.find({ studentId: req.params.id }).limit(1);
  if (student.length === 0)
    return res.status(404).send("Student Was not found");
  if (!student)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(student);
});

router.put(
  "/:id",
  [auth, validateObjectId, upload.single("file")],
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const data = {
      studentId: req.body.studentId,
      firstName: req.body.firstName,
      email: req.body.email,
      lastName: req.body.lastName,
      faculty: req.body.faculty,
      studentId: req.body.studentId,
    };
    req.file ? (data.studentImage = req.file.path) : null;
    const student = await Student.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!student)
      return res
        .status(404)
        .send("The student with the given ID was not found.");
    res.send(student);
  }
);
module.exports = router;
