

interface Subject {
  id: string
  name: string
  teacher: string
}

interface Room {
  id: string
  name: string
}

interface TimeSlot {
  id: string
  time: string
  subject?: Subject
  room?: Room
}

const initialSubjects: Subject[] = [
  { id: 'sub1', name: 'Mathematics', teacher: 'Mr. Smith' },
  { id: 'sub2', name: 'Physics', teacher: 'Mrs. Johnson' },
  { id: 'sub3', name: 'Chemistry', teacher: 'Dr. Brown' },
  { id: 'sub4', name: 'Biology', teacher: 'Ms. Davis' },
]

const initialRooms: Room[] = [
  { id: 'room1', name: '505' },
  { id: 'room2', name: '506' },
  { id: 'room3', name: '507' },
  { id: 'room4', name: '508' },
  { id: 'room5', name: '509' },
  { id: 'room6', name: '512' },
]

const initialTimeSlots: TimeSlot[] = [
  { id: 'slot1', time: '8:15-9:15' },
  { id: 'slot2', time: '9:15-10:15' },
  { id: 'slot3', time: '10:30-11:30' },
  { id: 'slot4', time: '11:30-12:30' },
  { id: 'slot5', time: '1:15-2:15' },
  { id: 'slot6', time: '2:15-3:15' },
]

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Button } from '../components/ui/button'

// ... (previous interfaces and initial data remain unchanged)

export default function CreateTimetablePage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots)

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === 'subjects' ||
      destination.droppableId === 'rooms'
    ) {
      return
    }

    const updatedTimeSlots = [...timeSlots]
    const targetSlot = updatedTimeSlots.find(
      (slot) => slot.id === destination.droppableId
    )

    if (targetSlot) {
      if (source.droppableId === 'subjects') {
        const subjectToAdd = subjects.find((sub) => sub.id === draggableId)
        if (subjectToAdd) {
          targetSlot.subject = subjectToAdd
        }
      } else if (source.droppableId === 'rooms') {
        const roomToAdd = rooms.find((room) => room.id === draggableId)
        if (roomToAdd) {
          targetSlot.room = roomToAdd
        }
      }
    }

    setTimeSlots(updatedTimeSlots)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Create Timetable for TYA</h1>
        <div className="flex mb-4">
          <div className="w-1/4 pr-4">
            <h2 className="text-lg font-semibold mb-2">Subjects</h2>
            <Droppable droppableId="subjects">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-2 rounded"
                >
                  {subjects.map((subject, index) => (
                    <Draggable key={subject.id} draggableId={subject.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-2 mb-2 rounded shadow"
                        >
                          {subject.name} - {subject.teacher}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
          <div className="w-1/4">
            <h2 className="text-lg font-semibold mb-2">Rooms</h2>
            <Droppable droppableId="rooms">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-2 rounded"
                >
                  {rooms.map((room, index) => (
                    <Draggable key={room.id} draggableId={room.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-2 mb-2 rounded shadow"
                        >
                          {room.name}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-2">Timetable</h2>
          <div className="grid grid-cols-3 gap-4">
            {timeSlots.map((slot) => (
              <Droppable key={slot.id} droppableId={slot.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-100 p-2 rounded"
                  >
                    <h3 className="font-medium mb-2">{slot.time}</h3>
                    <div className="bg-white p-2 h-24 rounded shadow">
                      {slot.subject && (
                        <p>
                          {slot.subject.name} - {slot.subject.teacher}
                        </p>
                      )}
                      {slot.room && <p>Room: {slot.room.name}</p>}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
        <Button className="mt-4">Save Timetable</Button>
      </div>
    </DragDropContext>
  )
}