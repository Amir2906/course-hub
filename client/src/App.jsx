import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <div className='main_body'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/student" element={<StudentDashboard />}/>
          <Route path="/course-details/:id" element={<CourseDetails />}/>
          <Route path="/login" element={<Login />}/>
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;