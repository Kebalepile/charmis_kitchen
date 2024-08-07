import React, { useState, useEffect } from 'react'
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
import Popup from './components/Popup'
import NotFound from './components/NotFound'
import { checkTime } from './utils/Utils'
import './App.css'

/**
 * @description
 * The App component is the main entry point of the application. It sets up
 * the routing for different pages using react-router-dom, including Home, About,
 * Contact, and a 404 Not Found page.
 * 
 * The Popup component displays a message and a close button.
 * The App component uses state to manage the visibility of the popup
 * and the message to be displayed. The useEffect hook checks the current
 * time when the component mounts and shows the popup if the time is outside 
 * the operating hours (6:30 AM to 6:30 PM).
 * 
 * The checkTime function is used to determine the current time and compare it
 * with the operating hours. If the current time is outside the specified range,
 * the popup message is set and the popup is shown to the user.
 */
function App () {
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  useEffect(() => {
    const { startTime, endTime, currentTime } = checkTime()

    if (currentTime < startTime || currentTime > endTime) {
      setPopupMessage('⚠️ Rebereka gare ga 6:30 AM le 18:30 PM. 🌞')
      setIsPopupVisible(true)
    }
  }, [])

  const handleClosePopup = () => {
    setIsPopupVisible(false)
  }

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
              {isPopupVisible && (
                <Popup message={popupMessage} onClose={handleClosePopup} />
              )}
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
