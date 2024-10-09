const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  name: String,
  subject: String,
  class: String
});

const Teacher = mongoose.model('Teacher', teacherSchema);


// Routes
app.post('/api/teachers', async (req, res) => {
  try {
    const { name, subject, class: className } = req.body;
    const teacher = new Teacher({ name, subject, class: className });
    await teacher.save();
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error adding teacher', error: error.message });
  }
});

app.get('/api/teachers/:class', async (req, res) => {
  try {
    const teachers = await Teacher.find({ class: req.params.class });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
});

const timetableSchema = new mongoose.Schema({
  day: String,
  time: String,
  teacher: String,
  room: String
})

const TTYA = mongoose.model('TT_TYA', timetableSchema)

app.post('/api/timetable/tya', async (req, res) => {
  try {
    const timetable = req.body.timetable
    await TTYA.insertMany(timetable)
    res.status(200).send('Timetable saved successfully')
  } catch (error) {
    res.status(500).send('Error saving timetable')
  }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));