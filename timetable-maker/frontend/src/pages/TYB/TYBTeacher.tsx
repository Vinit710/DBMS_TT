import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Link } from "react-router-dom"
import { Trash2, UserPlus, Calendar } from 'lucide-react'

interface Teacher {
  _id: string
  name: string
  subject: string
  class: string
}

export default function TYBPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [newTeacher, setNewTeacher] = useState({ name: "", subject: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/teachers/TYB')
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
        body: JSON.stringify({ ...newTeacher, class: "TYB" }),
      })
      const data = await response.json()
      setTeachers([...teachers, data])
      setNewTeacher({ name: "", subject: "" })
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error adding teacher:', error)
    }
  }

  const handleDeleteTeacher = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setTeachers(teachers.filter((teacher) => teacher._id !== id))
      } else {
        console.error('Failed to delete teacher')
      }
    } catch (error) {
      console.error('Error deleting teacher:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-green-800 text-center">Third Year B (TYB)</h1>
        
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  <UserPlus className="mr-2 h-4 w-4" /> Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
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
                <Button onClick={handleAddTeacher} className="w-full bg-blue-500 hover:bg-blue-600 text-white">Add Teacher</Button>
              </DialogContent>
            </Dialog>

            <Link to="/tyb/create-timetable">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                <Calendar className="mr-2 h-4 w-4" /> Create Timetable
              </Button>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Current Teachers</h2>
            {teachers.length > 0 ? (
              <ul className="space-y-4">
                {teachers.map((teacher) => (
                  <li key={teacher._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow">
                    <div>
                      <span className="font-semibold text-gray-700">{teacher.name}</span>
                      <span className="ml-2 text-gray-500">- {teacher.subject}</span>
                    </div>
                    <Button
                      onClick={() => handleDeleteTeacher(teacher._id)}
                      variant="destructive"
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">No teachers added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
