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
 * @returns {Promise<Order>} A promise that resolves to the updated order object.
 */
export const updateOrder = async (id, updateData) => {
  const response = await fetch(`${SERVER_DOMAIN}/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
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
 * @returns {Promise<void>} A promise that resolves when the order is deleted.
 */
export const deleteOrder = async (id) => {
  const response = await fetch(`${SERVER_DOMAIN}/orders/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete order');
  }
};
