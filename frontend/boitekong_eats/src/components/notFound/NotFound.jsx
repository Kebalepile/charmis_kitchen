import React, { useEffect } from 'react'
import Spinner from "../loading/Spinner"
import { useNavigate } from 'react-router-dom'
import { TbError404 } from 'react-icons/tb'

import './notFound.css'
function NotFound () {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to home after 3 seconds
    const timer = setTimeout(() => {
      navigate('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className='not-found'>
      <TbError404 className='img-404' />
      <h1>tlhogela go kgotlakgotla!</h1>
      <p>Redirecting to home page...</p>
      {<Spinner/>}
    </div>
  )
}

export default NotFound
