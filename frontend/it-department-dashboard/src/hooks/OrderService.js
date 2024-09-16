import { SERVER_DOMAIN } from "./types.js";

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

  const response = await fetch(`${SERVER_DOMAIN}/orders/by-cook`, {
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
    `${SERVER_DOMAIN}/orders/cooks_order/${orderNumber}`,
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
  const response = await fetch(`${SERVER_DOMAIN}/orders/${id}`, {
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
  const response = await fetch(`${SERVER_DOMAIN}/orders/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to delete order");
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
  username = username.toLocaleLowerCase();
  try {
    const response = await fetch(`${SERVER_DOMAIN}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, pin })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to log in");
    }

    // Save the token in session storage if login is successful
    if (data.token) {
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("cookId", username);
    }
    // console.log(data)

    return data;
  } catch (error) {
    throw new Error("Failed to log in. Please try again.");
  }
};

/**
 * @description logout an end-user pcurrently logged in.
 */

export const logout = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${SERVER_DOMAIN}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to logout");
    }
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("cookId");

    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to logout");
  }
};

/**
 * @description create login details for new end-user
 * @param {string} username
 */
export const signup = async username => {
  username = username.toLowerCase();
  try {
    let response = await fetch(`${SERVER_DOMAIN}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Username already exists");
    }

    return data;
  } catch (err) {
    throw new Error(
      err.message || "Username already exists. Please try again."
    );
  }
};
