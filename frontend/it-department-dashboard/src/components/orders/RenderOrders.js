import { renderOrderItem } from "../orderItem/OrderItem.js";
import "./orderFilter.css"
/**
 * @description Display orders placed, waiting to be fulfilled or cancelled based on their status.
 * @param {array} orders - The list of all orders.
 * @param {HTMLElement} orderListElement - The element where orders will be displayed.
 */
export const displayOrders = (orders, orderListElement) => {
  orderListElement.innerHTML = "";
  orders.forEach(order => {
    const orderItemElement = renderOrderItem(order);
    orderListElement.appendChild(orderItemElement);
  });
};

/**
 * @description Creates a toggle button group to filter orders by their status.
 * @param {array} orders - The list of all orders.
 * @param {HTMLElement} orderListElement - The element where filtered orders will be displayed.
 */

export const OrderFilter = (orders, orderListElement) => {
  // Remove existing filter buttons if present
  const existingFilterContainer = document.querySelector(".order-filter-container");
  if (existingFilterContainer) {
    existingFilterContainer.remove();
  }

  // Create the container for the buttons
  const filterContainer = document.createElement("div");
  filterContainer.className = "order-filter-container";

  // Define the statuses and count orders for each status
  const statuses = ["Ready", "Pending", "Cancelled", "All"];
  const statusCounts = {
    Ready: orders.filter(order => order.status.toLowerCase() === "ready").length,
    Pending: orders.filter(order => order.status.toLowerCase() === "pending").length,
    Cancelled: orders.filter(order => order.status.toLowerCase() === "cancelled").length,
    All: orders.length,
  };

  // Create buttons for each status
  statuses.forEach(status => {
    const button = document.createElement("button");
    button.textContent = `${status} (${statusCounts[status]})`; // Display the count in the button
    button.className = "filter-button";

    // Event listener to filter orders based on status
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
      
      // Add active class to the clicked button
      button.classList.add('active');

      // Filter and display the orders
      const filteredOrders = status === "All"
        ? orders
        : orders.filter(order => order.status.toLowerCase() === status.toLowerCase());
      displayOrders(filteredOrders, orderListElement);
    });

    filterContainer.appendChild(button);
  });

  // Append the filter buttons to the DOM (at the top of the order list)
  orderListElement.parentElement.insertBefore(filterContainer, orderListElement);

  // Display all orders initially
  displayOrders(orders, orderListElement);
};
