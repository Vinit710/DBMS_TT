import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'

import TYATeacher from './pages/TYA/TYATeacher'
import TYATimetable from './pages/TYA/TYATimetable'



function App() {
  return (
    
    

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tya/teachers" element={<TYATeacher />} />
          <Route path="/tya/create-timetable" element={<TYATimetable />} />
          {/* Add routes for other year groups as needed */}
        </Routes>
      </Router>
    
  )
}

export default App