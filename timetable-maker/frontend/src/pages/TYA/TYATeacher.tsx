import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Link } from "react-router-dom"

interface Teacher {
  _id: string
  name: string
  subject: string
  class: string
}

export default function TYAPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [newTeacher, setNewTeacher] = useState({ name: "", subject: "" })

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

  const handleAddTeacher = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newTeacher, class: "TYA" }),
      })
      const data = await response.json()
      setTeachers([...teachers, data])
      setNewTeacher({ name: "", subject: "" })
    } catch (error) {
      console.error('Error adding teacher:', error)
    }
  }

  const handleDeleteTeacher = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: 'DELETE',
      })
      setTeachers(teachers.filter((teacher) => teacher._id !== id))
    } catch (error) {
      console.error('Error deleting teacher:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
      <h1 className="text-3xl font-bold mb-8">Third Year A (TYA)</h1>
      
      <div className="space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Teachers</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={newTeacher.subject}
                  onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddTeacher}>Add Teacher</Button>
          </DialogContent>
        </Dialog>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Current Teachers</h2>
          <ul className="space-y-2">
            {teachers.map((teacher) => (
              <li key={teacher._id} className="bg-white p-4 rounded shadow">
                {teacher.name} - {teacher.subject}
                <Button className="ml-4" onClick={() => handleDeleteTeacher(teacher._id)}>Delete</Button>
              </li>
            ))}
          </ul>
        </div>

        <Link to="/tya/create-timetable">
          <Button className="mt-4">Create Timetable</Button>
        </Link>
      </div>
    </div>
  )
}
