import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import OrderContext from './context';
import Reducer from './reducer';
import {
  SET_QUANTITY,
  SET_NAME,
  SET_PHONE,
  SET_PAYMENT_METHOD,
  SET_DELIVERY_CHARGE,
  SET_TOTAL,
  SET_SELECTED_SIZE,
  RESET_STATE,
} from '../types';

const OrderProvider = ({ children }) => {
  const initialState = {
    quantity: 0,
    name: '',
    phone: '',
    paymentMethod: 'self-collect',
    deliveryCharge: 20,
    total: 0,
    selectedSize: '',
    fooMenu:''
  };

  const [state, dispatch] = useReducer(Reducer, initialState);
  const {
    quantity,
    name,
    phone,
    paymentMethod,
    deliveryCharge,
    total,
    selectedSize
  } = state;

  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > 25) {
      value = 25;
    }
    dispatch({ type: SET_QUANTITY, payload: value });
  };

  const handleNameChange = (e) => {
    dispatch({ type: SET_NAME, payload: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const cleanedPhone = e.target.value.replace(/\D/g, '');
    dispatch({ type: SET_PHONE, payload: cleanedPhone.slice(0, 10) });
  };

  const handlePaymentChange = (e) => {
    const method = e.target.value;
    dispatch({ type: SET_PAYMENT_METHOD, payload: method });
    dispatch({
      type: SET_DELIVERY_CHARGE,
      payload: method === 'cash' ? 20 : method === 'online' ? 15 : 0,
    });
  };

  const handleSizeChange = (e) => {
    dispatch({ type: SET_SELECTED_SIZE, payload: e.target.value });
  };

  const calculateTotal = (item) => {
    let price = 0;
    if (item.price) {
      price = parseInt(item.price.substring(1));
    } else if (item.prices && state.selectedSize) {
      price = parseInt(item.prices[state.selectedSize].substring(1));
    }

    const paymentCharge =
      state.paymentMethod === 'cash'
        ? 20
        : state.paymentMethod === 'online'
        ? 15
        : 0;
    const totalAmount = price * state.quantity + paymentCharge;

    dispatch({ type: SET_DELIVERY_CHARGE, payload: paymentCharge });
    dispatch({ type: SET_TOTAL, payload: totalAmount });
  };

  const generateOrderNumber = () => {
    // Generate a 4-digit random number using crypto API
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % 10000; // Ensure it's a 4-digit number
  };
  const handleSubmit = (e, foodMenu, item, onClose) => {
    e.preventDefault();
    const orderNumber = generateOrderNumber(); // Generate unique order number
   const orderDetails = {
    foodMenu,
    item,
    quantity: state.quantity,
    name: state.name,
    phone: state.phone,
    paymentMethod: state.paymentMethod,
    deliveryCharge: state.deliveryCharge,
    total: state.total,
    selectedSize: state.selectedSize,
    orderNumber
  } 
    console.log(orderDetails);
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    onClose();
    dispatch({ type: RESET_STATE, payload: initialState });
  };

  return (
    <OrderContext.Provider
      value={{
        quantity,
        name,
        phone,
        paymentMethod,
        deliveryCharge,
        total,
        selectedSize,
        handleQuantityChange,
        handleNameChange,
        handlePhoneChange,
        handlePaymentChange,
        handleSizeChange,
        calculateTotal,
        handleSubmit,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

OrderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OrderProvider;
