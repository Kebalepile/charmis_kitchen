import { createWebSocket } from "../hooks/useWebSocket.js";
import { renderOrderItem } from "./OrderItem.js";
import { updateOrderStats } from "./OrderStats.js";
import {
  fetchOrders,
  fetchOrderByOrderNumber,
  updateOrder,
  deleteOrder
} from "../hooks/OrderService.js";

const url = "ws://localhost:5000"; // Replace with your WebSocket server URL

document.addEventListener("DOMContentLoaded", async () => {
  const orderListElement = document.querySelector("#order-list");
  const orderStatsElement = document.querySelector("#order-stats");

  if (!orderListElement || !orderStatsElement) {
    console.log(orderListElement)
    console.log(orderStatsElement)
    console.error("Required DOM elements are missing.");
    return;
  }

  let orders = [];
  const processedOrderIds = new Set(); // Set to store processed order IDs

  const onMessage = data => {
    console.log("message via websocket");
    console.log(data);
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
  };

  const { socket, closeWebSocket } = createWebSocket(url, onMessage);

  const renderOrders = () => {
    orderListElement.innerHTML = '';
    orders.forEach(order => {
      const orderItemElement = renderOrderItem(order);
      orderListElement.appendChild(orderItemElement);
    });
  };

  try {
    orders = await fetchOrders();
    console.log("fetched orders via fetch api");
    renderOrders();
    updateOrderStats(orders, orderStatsElement);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  // Example usage of fetching, updating, and deleting orders
  // Uncomment these lines to test the functionality
  /*
  try {
    const order = await fetchOrderByOrderNumber('12345');
    console.log('Fetched order:', order);
  } catch (error) {
    console.error('Error fetching order:', error);
  }

  try {
    const updatedOrder = await updateOrder('order-id', { status: 'Completed' });
    console.log('Updated order:', updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
  }

  try {
    await deleteOrder('order-id');
    console.log('Order deleted');
  } catch (error) {
    console.error('Error deleting order:', error);
  }
  */
});
