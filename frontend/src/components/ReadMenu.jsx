import React, { useContext, useState, useEffect } from 'react'
import MenuContext from '../context/menu/context'
import { MENU } from '../context/types'
import Loading from './Loading'
import OrderForm from './OrderForm'

export default function ReadMenu () {
  const { ReadMenu: RM, CloseMenu } = useContext(MenuContext)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null) // State for the selected item
  const [showOrderForm, setShowOrderForm] = useState(false) // State to show/hide order form
  const [selectedFoodMenu, setSelectedFoodMenu] = useState(null)
  const menu = RM()

  useEffect(() => {
    // Simulate async fetch
    setTimeout(() => {
      setLoading(false)
    }, 2000) // Adjust delay as needed or replace with actual async call
  }, [])

  const handleClick = () => {
    CloseMenu(MENU, false)
  }

  const handleImageClick = imageUrl => {
    setSelectedImage(imageUrl)
  }

  const handleOverlayClick = () => {
    setSelectedImage(null)
  }

  const handleOrderClick = item => {
    setSelectedItem(item)
    setShowOrderForm(true)
  }

  const closeOrderForm = () => {
    setShowOrderForm(false)
  }

  return (
    <>
      <div className='overlay show' onClick={handleClick}></div>
      <section className='read-menu'>
        <section id="read-menu-nav">
        <button id='close-menu' onClick={handleClick}>
          X
        </button>
        </section>
        {menu ? (
          <>
            <h3> {menu.name} </h3>
            <hr className='bg-hr' />
          </>
        ) : (
          <p> No menu selected</p>
        )}

        {loading ? (
          <Loading />
        ) : (
          <>
            {menu && menu.items && menu.items.length > 0 ? (
              <ul>
                {menu.items.map((item, index) => (
                  <li key={index}>
                    <img
                      src={item.image_url}
                      alt={item.alt}
                      className='menu-img'
                      onClick={() => handleImageClick(item.image_url)}
                    />
                    <h3>{item.name}</h3>
                    {item.prices ? (
                      <ul>
                        {Object.entries(item.prices).map(([size, price]) => (
                          <li key={size}>
                            {size}: {price}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Price: {item.price}</p>
                    )}
                    <button
                      className='menu-btn'
                      onClick={() => {
                        setSelectedFoodMenu(menu.name)
                        handleOrderClick(item)
                      }}
                    >
                      Order
                    </button>
                    <hr className='bg-hr' />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items in the menu</p>
            )}
          </>
        )}
      </section>

      {selectedImage && (
        <div id='image-overlay' onClick={handleOverlayClick}>
          <div className='image-container'>
            <img src={selectedImage} alt='Enlarged' />
          </div>
        </div>
      )}

      {showOrderForm && (
        <OrderForm
          item={selectedItem}
          onClose={closeOrderForm}
          menuName={selectedFoodMenu}
        />
      )}
    </>
  )
}
