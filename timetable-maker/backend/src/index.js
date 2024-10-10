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

// Timetable Schema
const timetableSchema = new mongoose.Schema({
  day: String,
  time: String,
  teacher: String,
  room: String
});

const TTYA = mongoose.model('TT_TYA', timetableSchema);

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

// Add a new timetable entry
app.post('/api/timetable/tya', async (req, res) => {
  try {
    const entry = new TTYA(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error adding timetable entry', error: error.message });
  }
});

// Get all timetable entries
app.get('/api/timetable/tya', async (req, res) => {
  try {
    const entries = await TTYA.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetable entries', error: error.message });
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

// Update a timetable entry
app.put('/api/timetable/tya/:id', async (req, res) => {
  try {
    const updatedEntry = await TTYA.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEntry) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }
    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error updating timetable entry', error: error.message });
  }
});

// Delete a timetable entry
app.delete('/api/timetable/tya/:id', async (req, res) => {
  try {
    const deletedEntry = await TTYA.findByIdAndDelete(req.params.id);
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }
    res.json({ message: 'Timetable entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting timetable entry', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));