// src/utils/localStorageUtils.js

/**
 * @function getStoredOrderData
 * @description Retrieves the order data stored in localStorage under the key 'orderData'.
 * @returns {Object|null} Returns the parsed order data object if available, otherwise returns null.
 */
export const getStoredOrderData = (keyItem='orderData') => {
  const storedOrderData = localStorage.getItem(keyItem);
  return storedOrderData ? JSON.parse(storedOrderData) : null;
};

/**
 * @function clearStoredOrderData
 * @description Clears the stored order data from localStorage.
 */
export const clearStoredOrderData = (keyItem='orderData') => {
  localStorage.removeItem(keyItem);
};
