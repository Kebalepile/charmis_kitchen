import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import NotFound from './components/NotFound'
import './App.css'

function App () {
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <>
              <Navbar />
              <Home />
              <About />
              <Contact />
            </>
          }
        />
        <Route path='/404' element={<NotFound />} />
        <Route path='*' element={<Navigate to='/404' replace />} />
      </Routes>
    </Router>
  )
}

export default App
