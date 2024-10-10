import React, { useState, useEffect } from 'react';
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

interface Teacher {
  _id: string;
  name: string;
  subject: string;
  class: string;
}

interface TimetableEntry {
  _id: string;
  day: string;
  time: string;
  teacher: string;
  subject: string;
  room: string;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = ["8:15 - 9:15", "9:15 - 10:15", "10:30 - 11:30", "11:30 - 12:30", "1:15 - 2:15", "2:15 - 3:15"];
const rooms = ["509", "512", "506", "508", "507", "502", "505"];

export default function TYBTimetable() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [selectedTime, setSelectedTime] = useState<string>("8:15 - 9:15");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("509");
  const [timetableData, setTimetableData] = useState<TimetableEntry[]>([]);

  useEffect(() => {
    fetchTeachers();
    fetchTimetable();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/teachers/TYB');
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchTimetable = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/timetable/tyb');
      const data = await response.json();
      setTimetableData(data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    }
  };

  const handleAddEntry = async () => {
    const selectedTeacherObj = teachers.find(t => t._id === selectedTeacher);
    if (!selectedTeacherObj) return;

    const entry: Omit<TimetableEntry, '_id'> = {
      day: selectedDay,
      time: selectedTime,
      teacher: selectedTeacherObj.name,
      subject: selectedTeacherObj.subject,
      room: selectedRoom
    };

    try {
      const response = await fetch('http://localhost:5000/api/timetable/tyb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        alert('Entry added successfully!');
        fetchTimetable(); // Refresh the timetable data
      } else {
        const errorData = await response.json();
        alert(`Failed to add entry: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const getTimetableCell = (day: string, time: string) => {
    const entry = timetableData.find(e => e.day === day && e.time === time);
    if (entry) {
      return (
        <div className="p-2 bg-blue-100 rounded">
          <p className="font-semibold">{entry.teacher} - {entry.subject}</p>
          <p className="text-sm">Room: {entry.room}</p>
        </div>
      );
    }
    return <div className="p-2 bg-gray-100 rounded">-</div>;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-white p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-blue-800">TYB Timetable</h1>

      <div className="max-w-7xl mx-auto bg-white p-4 sm:p-8 rounded-lg shadow-lg">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-blue-700">Add New Entry</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div>
            <Label className="text-gray-700">Day</Label>
            <select
              className="w-full p-2 mt-1 border rounded"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-gray-700">Time</Label>
            <select
              className="w-full p-2 mt-1 border rounded"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              {times.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-gray-700">Teacher</Label>
            <select
              className="w-full p-2 mt-1 border rounded"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name} - {teacher.subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-gray-700">Room</Label>
            <select
              className="w-full p-2 mt-1 border rounded"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              {rooms.map((room) => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button onClick={handleAddEntry} className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
            Add Entry
          </Button>
        </div>
      </div>

      <div className="mt-12 max-w-7xl mx-auto bg-white p-4 sm:p-8 rounded-lg shadow-lg overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-blue-700">Current Timetable</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100">Time</th>
              {days.map(day => (
                <th key={day} className="border p-2 bg-gray-100">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time}>
                <td className="border p-2 font-semibold">{time}</td>
                {days.map(day => (
                  <td key={`${day}-${time}`} className="border p-2">
                    {getTimetableCell(day, time)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
