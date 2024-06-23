import React, { useState, useEffect } from 'react'
import p1 from '../assets/images/pizza/1.jpg'
import p2 from '../assets/images/pizza/1.jpg'
import p3 from '../assets/images/pizza/1.jpg'
import c1 from '../assets/images/chicken/1.jpg'
import c2 from '../assets/images/chicken/1.jpg'
import c3 from '../assets/images/chicken/1.jpg'

const images = [
  {
    src: p1,
    text: ' Lorem ipsum, dolor sit amet consectetur adipisicing'
  },
  {
    src: p2,
    text: ' Lorem ipsum, dolor sit amet consectetur adipisicing'
  },
  {
    src: p3,
    text: ' Lorem ipsum, dolor sit amet consectetur adipisicing'
  },
  {
    src: c1,
    text: 'Lorem ipsum, dolor sit amet consectetur adipisicing'
  },
  {
    src: c2,
    text: 'Lorem ipsum, dolor sit amet consectetur adipisicing'
  },
  {
    src: c3,
    text: 'Lorem ipsum, dolor sit amet consectetur adipisicing'
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
        <div className='slide-text'>{text}</div>
      </div>
    </div>
  )
}

export default Slideshow
