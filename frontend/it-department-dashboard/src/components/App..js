import { createWebSocket } from "../hooks/useWebSocket.js";
import { renderLoginForm } from "./src/components/Login.js";
import { renderOrderItem } from "./OrderItem.js";
import { updateOrderStats } from "./OrderStats.js";
import { fetchOrders } from "../hooks/OrderService.js";

const url = "ws://localhost:5000"; // Replace with your WebSocket server URL

document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = renderLoginForm();
  document.body.appendChild(loginForm);
  const orderListElement = document.body.querySelector("#order-list");
  const orderStatsElement = document.body.querySelector("#order-stats");

  if (!orderListElement || !orderStatsElement) {
    console.error("Required DOM elements are missing.");
    return;
  }

  let orders = [];
  const processedOrderIds = new Set(); // Set to store processed order IDs

  const onMessage = data => {
    // console.log("message via websocket");
    // console.log(data);
    if (data.type === "initialData") {
      // Only add orders that haven't been processed yet
      data.orders.forEach(order => {
        if (!processedOrderIds.has(order._id)) {
          orders.push(order);
          processedOrderIds.add(order._id);
        }
      });
    } else if (data.type === "newOrder") {
      // Check if the order ID is already processed
      if (!processedOrderIds.has(data.order._id)) {
        orders.push(data.order);
        processedOrderIds.add(data.order._id);
      }
    } else if (data.type === "updateOrder") {
      const index = orders.findIndex(order => order._id === data.order._id);
      if (index !== -1) {
        orders[index] = data.order;
      }
    } else if (data.type === "deleteOrder") {
      orders = orders.filter(order => order._id !== data.orderId);
    }
    renderOrders();
    updateOrderStats(orders, orderStatsElement);
  };

  const { socket, closeWebSocket } = createWebSocket(url, onMessage);

  const renderOrders = () => {
    orderListElement.innerHTML = "";
    orders.forEach(order => {
      const orderItemElement = renderOrderItem(order);
      orderListElement.appendChild(orderItemElement);
    });
  };

  try {
    orders = await fetchOrders();
    // console.log("fetched orders via fetch api");
    renderOrders();
    updateOrderStats(orders, orderStatsElement);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
});
