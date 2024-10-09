import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

interface Teacher {
  _id: string
  name: string
  subject: string
  class: string
}

interface TimetableEntry {
  day: string
  time: string
  teacher: string
  room: string
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const times = ["8:15 - 9:15", "9:15 - 10:15", "10:30 - 11:30", "11:30 - 12:30", "1:15 - 2:15", "2:15 - 3:15"]
const rooms = ["509", "512", "506", "508", "507", "502", "505"]

export default function CreateTimetable() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedDay, setSelectedDay] = useState<string>("Monday")
  const [selectedTime, setSelectedTime] = useState<string>("8:15 - 9:15")
  const [selectedTeacher, setSelectedTeacher] = useState<string>("")
  const [selectedRoom, setSelectedRoom] = useState<string>("509")
  const [newEntry, setNewEntry] = useState<TimetableEntry[]>([])

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/teachers/TYA')
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  const handleAddEntry = () => {
    const entry: TimetableEntry = {
      day: selectedDay,
      time: selectedTime,
      teacher: selectedTeacher,
      room: selectedRoom
    }
    setNewEntry([...newEntry, entry])
  }

  const handleSaveTimetable = async () => {
    try {
      await fetch('http://localhost:5000/api/timetable/tya', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timetable: newEntry }),
      })
      alert('Timetable saved successfully!')
      setNewEntry([])
    } catch (error) {
      console.error('Error saving timetable:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Timetable for TYA</h1>

      <div className="space-y-4 max-w-4xl mx-auto">
        {/* Align inputs horizontally with some padding */}
        <div className="grid grid-cols-4 gap-6 mb-6 items-center bg-white p-6 rounded shadow-lg">
          <div>
            <Label>Day</Label>
            <select
              className="w-full p-2 mt-1 border rounded"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Time</Label>
            <select
              className="w-full p-2 mt-1 border rounded"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              {times.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Teacher</Label>
            <select
              className="w-full p-2 mt-1 border rounded"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher.name}>
                  {teacher.name} ({teacher.subject})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Room</Label>
            <select
              className="w-full p-2 mt-1 border rounded"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              {rooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add entry button */}
        <div className="flex justify-center">
          <Button onClick={handleAddEntry} className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600">
            Add Entry
          </Button>
        </div>

        {/* Timetable entries */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Timetable Entries</h2>
          <ul className="space-y-2">
            {newEntry.map((entry, index) => (
              <li key={index} className="bg-white p-4 rounded shadow-md border border-gray-200">
                <span className="font-semibold">{entry.day}</span>, {entry.time} - <span className="font-semibold">{entry.teacher}</span> ({entry.room})
              </li>
            ))}
          </ul>
        </div>

        {/* Save timetable button */}
        <div className="flex justify-center mt-6">
          <Button onClick={handleSaveTimetable} className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600">
            Save Timetable
          </Button>
        </div>
      </div>
    </div>
  )
}
