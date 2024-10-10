const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Teacher Schema for tya
const teacherSchema = new mongoose.Schema({
  name: String,
  subject: String,
  class: String
});

const Teacher = mongoose.model('Teacher', teacherSchema);


// Teacher TYB Schema
const teacherTYBSchema = new mongoose.Schema({
  name: String,
  subject: String,
  class: String
});

const TeacherTYB = mongoose.model('Teacher_TYB', teacherTYBSchema);




// Timetable Schema for TYA
const timetableSchemaTYA = new mongoose.Schema({
  day: String,
  time: String,
  teacher: String,
  subject: String,
  room: String
});

const TTYA = mongoose.model('TT_TYA', timetableSchemaTYA);

// Timetable Schema for TYB
const timetableSchemaTYB = new mongoose.Schema({
  day: String,
  time: String,
  teacher: String,
  subject: String,
  room: String
});

const TYB = mongoose.model('TT_TYB', timetableSchemaTYB);

// Routes

// Add a new teacher
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

// Get teachers for a specific class
app.get('/api/teachers/:class', async (req, res) => {
  try {
    const teachers = await Teacher.find({ class: req.params.class });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
});

// Delete a teacher
app.delete('/api/teachers/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully', teacher });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher', error: error.message });
  }
});

// Add a new timetable entry for TYA with conflict check
app.post('/api/timetable/tya', async (req, res) => {
  try {
    const { day, time, teacher, room } = req.body;

    // Check for conflicts in both TYA and TYB timetables
    const conflictTYA = await TTYA.findOne({ day, time, $or: [{ teacher }, { room }] });
    const conflictTYB = await TYB.findOne({ day, time, $or: [{ teacher }, { room }] });

    if (conflictTYA || conflictTYB) {
      return res.status(400).json({ message: 'Conflict detected: Same room or teacher already assigned at the same time.' });
    }

    // No conflict, add the new entry
    const entry = new TTYA(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error adding timetable entry', error: error.message });
  }
});

// Get all timetable entries for TYA
app.get('/api/timetable/tya', async (req, res) => {
  try {
    const entries = await TTYA.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetable entries', error: error.message });
  }
});









//tyb

// Add a new timetable entry for TYB with conflict check
app.post('/api/timetable/tyb', async (req, res) => {
  try {
    const { day, time, teacher, room } = req.body;

    // Check for conflicts in both TYA and TYB timetables
    const conflictTYA = await TTYA.findOne({ day, time, $or: [{ teacher }, { room }] });
    const conflictTYB = await TYB.findOne({ day, time, $or: [{ teacher }, { room }] });

    if (conflictTYA || conflictTYB) {
      return res.status(400).json({ message: 'Conflict detected: Same room or teacher already assigned at the same time.' });
    }

    // No conflict, add the new entry
    const entry = new TYB(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error adding timetable entry', error: error.message });
  }
});
// Get TYB teachers
app.get('/api/teachers/tyb', async (req, res) => {
  try {
    const teachers = await TeacherTYB.find({ class: 'TYB' });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching TYB teachers', error: error.message });
  }
});

// Delete a TYB teacher
app.delete('/api/teachers/tyb/:id', async (req, res) => {
  try {
    const teacher = await TeacherTYB.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'TYB Teacher not found' });
    }
    res.json({ message: 'TYB Teacher deleted successfully', teacher });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting TYB teacher', error: error.message });
  }
});


// Add a new timetable entry for TYB
app.post('/api/timetable/tyb', async (req, res) => {
  try {
    const entry = new TYB(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error adding timetable entry', error: error.message });
  }
});

// Get all timetable entries for TYB
app.get('/api/timetable/tyb', async (req, res) => {
  try {
    const entries = await TYB.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetable entries', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
