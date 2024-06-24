import React, { useContext, useState, useEffect } from 'react';
import MenuContext from '../context/menu/context';
import { MENU } from '../context/types';

export default function ReadMenu() {
  const { ReadMenu: RM, CloseMenu } = useContext(MenuContext);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
  const menu = RM();

  useEffect(() => {
    // Simulate async fetch
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust delay as needed or replace with actual async call
  }, []);

  const handleClick = () => {
    CloseMenu(MENU, false);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleOverlayClick = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div id="overlay" className="show" onClick={handleClick}></div>
      <section id='read-menu'>
        <p>{menu ? menu.name : 'No menu selected'}</p>

        {loading ? (
          <div className="loading-container">
            <div className="loading-dot" style={{ '--i': 1 }}></div>
            <div className="loading-dot" style={{ '--i': 2 }}></div>
            <div className="loading-dot" style={{ '--i': 3 }}></div>
          </div>
        ) : (
          <>
            {menu && menu.items && menu.items.length > 0 ? (
              <ul>
                {menu.items.map((item, index) => (
                  <li key={index}>
                    <img
                      src={item.image_url}
                      alt={item.alt}
                      className="menu-img"
                      onClick={() => handleImageClick(item.image_url)} // Add click handler for images
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
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items in the menu</p>
            )}
          </>
        )}

        <button id='close-menu' onClick={handleClick}>
          Close menu
        </button>
      </section>

      {selectedImage && (
        <div id="image-overlay" onClick={handleOverlayClick}>
          <div className="image-container">
            <img src={selectedImage} alt="Enlarged" />
          </div>
        </div>
      )}
    </>
  );
}
