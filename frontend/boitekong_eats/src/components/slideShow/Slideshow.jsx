import React, { useState, useEffect } from 'react'
import p1 from '../../assets/images/pizza/1.jpg'
import p2 from '../../assets/images/pizza/4.jpg'
import p3 from '../../assets/images/pizza/3.jpg'
import c1 from '../../assets/images/chicken/1.jpg'
import c2 from '../../assets/images/chicken/3.jpg'
import a1 from '../../assets/images/dikuku/2.jpg'
import b1 from '../../assets/images/magwinya/1.jpg'

import './slideShow.css'
const images = [
  {
    src: a1,
    text: 'Goodness Awaits!'
  },
  {
    src: b1,
    text: 'Crispy Delights, Savory Bites!'
  },
  {
    src: p1,
    text: 'Sizzling Hot Pizza Just For You!'
  },
  {
    src: p2,
    text: 'Indulge in Our Cheesy Delight!'
  },
  {
    src: p3,
    text: 'Your Perfect Slice of Happiness!'
  },
  {
    src: c1,
    text: 'Unforgettable Flavor!'
  },
  {
    src: c2,
    text: 'Bite Into Juicy Chicken Perfection!'
  }
  // Add more images as needed
]

const Slideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(intervalId)
  }, [])

  const { src, text } = images[currentImageIndex]

  return (
    <div className='slideshow'>
      <div className='slide' style={{ backgroundImage: `url(${src})` }}>
        <div className='slide-text'>
          <p>{text}</p>
        </div>
      </div>
    </div>
  )
}

export default Slideshow
