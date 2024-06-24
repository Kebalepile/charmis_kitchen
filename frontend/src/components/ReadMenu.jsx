import React, { useContext, useState, useEffect } from 'react';
import MenuContext from '../context/menu/context';
import { MENU } from '../context/types';

export default function ReadMenu() {
  const { ReadMenu: RM, CloseMenu } = useContext(MenuContext);
  const [loading, setLoading] = useState(true);
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

  return (
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
                  <img src={item.image_url} alt={item.alt} className="menu-img" />
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
  );
}
