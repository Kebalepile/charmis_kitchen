import React, { useContext, useEffect, useState } from 'react';
import OrderContext from '../../context/order/context';
import PropTypes from 'prop-types';
import Popup from '../popup/Popup';
import './order.css';

const OrderForm = ({ item, onClose, menuName }) => {
  const {
    quantity,
    total,
    selectedSize,
    handleQuantityChange,
    handleSizeChange,
    calculateTotal,
    handleSubmit,
    handleRest
  } = useContext(OrderContext);

  const [quantityInput, setQuantityInput] = useState(quantity);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    if (item && (item.price || (item.prices && selectedSize))) {
      calculateTotal(item);
    }
  }, [item, selectedSize, quantity]);

 
  const handleImageClick = imageUrl => {
    setSelectedImage(imageUrl)
  }

  const handleOverlayClick = () => {
    setSelectedImage(null)
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validation check for selectedSize
    if (item?.prices && (selectedSize === undefined || selectedSize === '' || parseFloat(selectedSize) <= 0)) {
      setPopupMessage('Please select a valid size before adding to the basket.');
      setShowPopup(true);
      return; // Prevent submission
    }

    setPopupMessage(
      "🛒 Order added to cart! Check your basket when you're done ordering."
    );
    setShowPopup(true);

    setTimeout(() => {
      handleSubmit(e, menuName, item, onClose);
    }, 3000);
  };

  const handleQuantityInputChange = (e) => {
    const value = e.target.value;
    setQuantityInput(value);
    handleQuantityChange(e);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  const handleClose = () => {
    handleRest();
    onClose();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (size) => {
    handleSizeChange({ target: { value: size } });
    setIsOpen(false);
  };

  return (
    <div id='price-form'>
      <div className='overlay show' onClick={handleClose}></div>
      <div>
        <form onSubmit={handleFormSubmit} className='select-order'>
        <img
                      src={item.image_url}
                      alt={item.alt}
                      className='menu-img select'
                      onClick={() => handleImageClick(item.image_url)}
                    />
          <h3>{item?.name}</h3>
          <hr className='bg-hr' />
          {item?.prices ? (
            <div className='form-group size-select'>
              <div className='custom-select'>
                <div className='select-selected' onClick={toggleDropdown}>
                  {selectedSize || 'Select Size'}
                </div>
                {isOpen && (
                  <div className='select-items'>
                    {Object.entries(item.prices).map(([size, price]) => (
                      <div key={size} className='select-item' onClick={() => handleSelect(size)}>
                        {size} - {price}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p>
              <strong>Price: {item?.price}</strong>
            </p>
          )}
          <div className='form-group'>
            <label className='quantity-question'>
              {item.quantity_question}
              <input
                type='number'
                value={quantityInput}
                onChange={handleQuantityInputChange}
                min='1'
                max='25'
                placeholder='1'
                required
              />
            </label>
          </div>
          <p>
            <strong>Total Amount: R{total}.00</strong>
          </p>
          <section className="buttons">
          <button type='submit' className='basket-btn'>
          Add to Cart
          </button>
          <button type='button' className='cancel' onClick={handleClose}>
            Cancel
          </button>
          </section>
        </form>
      </div>
      {selectedImage && (
        <div id='image-overlay' onClick={handleOverlayClick}>
          <div className='image-container'>
            <img src={selectedImage} alt='Enlarged' />
          </div>
        </div>
      )}
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
    </div>
  );
};

OrderForm.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  menuName: PropTypes.string.isRequired
};

export default OrderForm;
