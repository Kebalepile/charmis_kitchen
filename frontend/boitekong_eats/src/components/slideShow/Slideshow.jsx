import React, { useState, useEffect } from 'react'
import './slideShow.css'

const images = [
  // {
  //   src: './assets/images/dikuku/2.jpg',
  //   text: 'Goodness Awaits!'
  // },
  {
    src: './assets/images/magwinya/1.jpg',
    text: 'Crispy Delights, Savory Bites!'
  },
  {
    src: './assets/images/pizza/1.jpg',
    text: 'Sizzling Hot Pizza Just For You!'
  },
  {
    src: './assets/images/pizza/4.jpg',
    text: 'Indulge in Our Cheesy Delight!'
  },
  {
    src: './assets/images/pizza/3.jpg',
    text: 'Your Perfect Slice of Happiness!'
  },
  {
    src: './assets/images/chicken/1.jpg',
    text: 'Unforgettable Flavor!'
  },
  {
    src: './assets/images/chicken/3.jpg',
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
