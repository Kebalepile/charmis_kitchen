// src/utils/localStorageUtils.js

/**
 * @function getStoredOrderData
 * @description Retrieves the order data stored in localStorage under the key 'orderData'.
 * @returns {Object|null} Returns the parsed order data object if available, otherwise returns null.
 */
export const getStoredOrderData = () => {
  const storedOrderData = localStorage.getItem('orderData');
  return storedOrderData ? JSON.parse(storedOrderData) : null;
};

/**
 * @function clearStoredOrderData
 * @description Clears the stored order data from localStorage.
 */
export const clearStoredOrderData = () => {
  localStorage.removeItem('orderData');
};
