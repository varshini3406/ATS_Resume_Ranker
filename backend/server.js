const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔗 CONNECT TO MONGODB
mongoose.connect("mongodb+srv://varshinigujju:varu1234@cluster0.ejjl9ce.mongodb.net/resumedb?retryWrites=true&w=majority")

  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// 📄 Resume Schema
const ResumeSchema = new mongoose.Schema({
  filename: String,
  score: Number,
  matched_skills: [String],
  missing_skills: [String]
});

const Resume = mongoose.model("Resume", ResumeSchema);

// 📌 GET ALL RESUMES
app.get("/resumes", async (req, res) => {
  const resumes = await Resume.find();
  res.json(resumes);
});

// 📌 ADD RESUME
app.post("/resumes", async (req, res) => {
  const newResume = new Resume(req.body);
  await newResume.save();
  res.json(newResume);
});

app.listen(5000, () => console.log("Server running on port 5000"));