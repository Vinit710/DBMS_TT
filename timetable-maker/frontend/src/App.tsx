import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'

// Import components for TYA
import TYATeacher from './pages/TYA/TYATeacher'
import TYATimetable from './pages/TYA/TYATimetable'

// Import components for TYB
import TYBTeacher from './pages/TYB/TYBTeacher'
import TYBTimetable from './pages/TYB/TYBTimetable'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Routes for TYA */}
        <Route path="/tya/teachers" element={<TYATeacher />} />
        <Route path="/tya/create-timetable" element={<TYATimetable />} />

        {/* Routes for TYB */}
        <Route path="/tyb/teachers" element={<TYBTeacher />} />
        <Route path="/tyb/create-timetable" element={<TYBTimetable />} />

        {/* Add routes for other year groups as needed */}
      </Routes>
    </Router>
  )
}

export default App
