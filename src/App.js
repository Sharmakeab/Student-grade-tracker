import React from 'react'
import { Route,Routes } from 'react-router-dom'
import GradeForm from './components/GradeForm'
import Navbar from './Navbar'
import Home from './components/Home'
import Registerstudent from './components/Registerstudent'
function app() {
  return (
    <div>
       <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
         <Route path='/Registerstudent' element={<Registerstudent/>} />
        <Route path='/Gradeform' element={<GradeForm />} />
       
      </Routes>

    </div>
  )
}

export default app