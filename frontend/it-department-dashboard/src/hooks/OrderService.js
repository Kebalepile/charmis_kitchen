import { SERVER_DOMAIN } from './types.js';

/**
 * Fetch all orders from the server.
 * 
 * @returns {Promise<Array<Order>>} A promise that resolves to an array of orders.
 */
export const fetchOrders = async () => {
  const response = await fetch(`${SERVER_DOMAIN}/orders`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};

/**
 * Fetch an order by order number.
 * 
 * @param {string} orderNumber - The order number.
 * @returns {Promise<Order>} A promise that resolves to the order object.
 */
export const fetchOrderByOrderNumber = async (orderNumber) => {
  const response = await fetch(`${SERVER_DOMAIN}/orders/${orderNumber}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }
  return response.json();
};

/**
 * Update an order by ID.
 * 
 * @param {string} id - The order ID.
 * @param {Object} updateData - The update data.
 * @param {string} token - The JWT token.
 * @returns {Promise<Order>} A promise that resolves to the updated order object.
 */
export const updateOrder = async (id, updateData, token) => {
  const response = await fetch(`${SERVER_DOMAIN}/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });
  if (!response.ok) {
    throw new Error('Failed to update order');
  }
  return response.json();
};

/**
 * Delete an order by ID.
 * 
 * @param {string} id - The order ID.
 * @param {string} token - The JWT token.
 * @returns {Promise<void>} A promise that resolves when the order is deleted.
 */
export const deleteOrder = async (id, token) => {
  const response = await fetch(`${SERVER_DOMAIN}/orders/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to delete order');
  }
};


/**
 * Log in a user to obtain a JWT token.
 * 
 * @param {string} username - The username.
 * @param {string} pin - The PIN.
 * @returns {Promise<string>} A promise that resolves to the JWT token.
 */
export const login = async (username, pin) => {
   // Generate salt
   const salt = bcrypt.genSaltSync(10);

   // Hash the PIN
   const hashedPin = bcrypt.hashSync(pin, salt);
 
   const response = await fetch(`${SERVER_DOMAIN}/login`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({ username, pin: hashedPin })
   });
 
   if (!response.ok) {
     throw new Error('Failed to log in');
   }
 
   const data = await response.json();
 
   // Save the token in session storage
   sessionStorage.setItem('token', data.token);
 
   return data.token;
 }

