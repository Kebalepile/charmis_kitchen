import { createWebSocket } from "./hooks/useWebSocket.js";
import { renderLoginForm } from "./components/login/Login.js";
import { OrderFilter } from "./components/orders/RenderOrders.js";
import { refresh } from "./utils/helper.js";
import { fetchOrders } from "./hooks/OrderService.js";
import { DEVELOPMENT_WEBSOCKET_URL  } from "./config.js";
import { hasSpecialPrivilege } from "./hooks/Authentication.js";

document.addEventListener("DOMContentLoaded", async () => {
  const appContainer = document.body;
  // Check if the token exists in session storage
  const token = sessionStorage.getItem("token");

  if (!token) {
    // If no token, render the login form
    const loginForm = renderLoginForm();
    appContainer.innerHTML = ""; // Clear any existing content
    appContainer.appendChild(loginForm);
    return;
  }

  // Token exists, continue with fetching orders and handling WebSocket connection
  const orderListElement = appContainer.querySelector("#order-list");
  const orderStatsElement = appContainer.querySelector("#order-stats");

  if (!orderListElement || !orderStatsElement) {
    console.error("Required DOM elements are missing.");
    return;
  }

  let orders = [];
  const processedOrderIds = new Set(); // Set to store processed order IDs

  const handleWebSocketMessage = data => {
    const handlers = {
      connected: () => console.log(data.message),
      newOrder: () => {
        if (!processedOrderIds.has(data.order._id)) {
          orders.push(data.order);
          processedOrderIds.add(data.order._id);
        }
      },
      updateOrder: () => {
        const index = orders.findIndex(order => order._id === data.order._id);
        if (index !== -1) {
          orders[index] = data.order;
        }
      },
      deleteOrder: () => {
        orders = orders.filter(order => order._id !== data.orderId);
      },
      newSignup: () => console.log(data.user),
      userLogin: () => console.log(data.user),
      userLogout: () => console.log(data.user),
      smsSent: () => console.log(data.info),
      smsFailed: () => console.log(data.info),
      smsError: () => console.log(data.info)
    };

    // Check for a specific channel if needed
    if (data.channel) {
      // Handle messages based on channel
      console.log(`Received message on channel: ${data.channel}`);
    }

    // Call the appropriate handler based on the data type, if it exists
    const handler = handlers[data.type];

    // handler();

    // Re-render orders and update stats after handling any WebSocket message
    OrderFilter(orders, orderListElement);
  };

  createWebSocket(DEVELOPMENT_WEBSOCKET_URL , handleWebSocketMessage);

  const showError = message => {
    let messageElement = document.querySelector(".error-message");

    if (!messageElement) {
      messageElement = document.createElement("p");
      messageElement.className = "error-message";
      appContainer.appendChild(messageElement);
    }

    messageElement.textContent = message;
  };

  const hideError = () => {
    const messageElement = document.querySelector(".error-message");
    if (messageElement) {
      messageElement.remove();
    }
  };

  try {
    hideError(); // Hide any existing error message
    const result = await fetchOrders();

    if (result.error) {
      showError(result.error); // Show error message
      const cookError = result.error
        .toLowerCase()
        .includes("no orders found for this cook");

      // If cookError is false (i.e., the error does not include that string), run the refresh function
      if (!cookError) {
        // Run the refresh function after 3 seconds and clear session storage
        refresh(3000, () => sessionStorage.clear());
      }
    } else {
      orders = result;
      OrderFilter(orders, orderListElement);
      // updateOrderStats(orders, orderStatsElement);
    }

    const hasPrivilege = await hasSpecialPrivilege();
    if (hasPrivilege) {
      // Remove the #order-stats element from the DOM
      const orderStats = document.querySelector(".card");
      if (orderStats) {
        orderStats.remove();
      }
      const searchButton = document.querySelector(".search-button");

      if (searchButton) {
        searchButton.remove();
      }
      const element = document.querySelector("p.error-message");

      if (element.textContent.trim() === "🍽️, No orders found for this cook") {
        element.remove();
      }
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
});
