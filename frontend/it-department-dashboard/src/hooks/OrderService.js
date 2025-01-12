import { DEVELOPMENT_SERVER_DOMAIN } from "../config";

/**
 * Fetch all orders from the server with a specified cookId.
 * 
 * @param {string} cookId - The cook ID.
 * @returns {Promise<Array<Order>>} A promise that resolves to an array of orders.
 */
export const fetchOrders = async (
  cookId = sessionStorage.getItem("cookId")
) => {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${DEVELOPMENT_SERVER_DOMAIN}/orders/by-cook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ cookId })
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { error: errorData.message || "An error occurred" };
  }

  return response.json();
};

/**
 * Fetch an order by order number.
 * 
 * @param {string} orderNumber - The order number.
 * @returns {Promise<Order>} A promise that resolves to the order object.
 */
export const fetchOrderByOrderNumber = async orderNumber => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(
    `${DEVELOPMENT_SERVER_DOMAIN}/orders/cooks_order/${orderNumber}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }

  return response.json();
};

/**
 * Update an order by ID.
 * 
 * @param {string} id - The order ID.
 * @param {Object} updates - The update data.
 
 * @returns {Promise<Order>} A promise that resolves to the updated order object.
 */
export const updateOrder = async (id, updates) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${DEVELOPMENT_SERVER_DOMAIN}/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  if (!response.ok) {
    throw new Error("Failed to update order");
  }
  return response.json();
};

/**
 * Delete an order by ID.
 * 
 * @param {string} id - The order ID.
 
 * @returns {Promise<void>} A promise that resolves when the order is deleted.
 */
export const deleteOrder = async id => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${DEVELOPMENT_SERVER_DOMAIN}/orders/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to delete order");
  }
};


