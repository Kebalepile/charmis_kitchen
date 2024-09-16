import { renderOrderItem } from "../orderItem/OrderItem.js";
import { renderLoadingSpinner } from "../loading/LoadingSpinner.js"; // Import the loading spinner component
import "./orderFilter.css";

/**
 * @description Display orders placed, waiting to be fulfilled, or canceled based on their status.
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
  const existingFilterContainer = document.querySelector(
    ".order-filter-container"
  );
  if (existingFilterContainer) {
    existingFilterContainer.remove();
  }

  // Create the container for the buttons
  const filterContainer = document.createElement("div");
  filterContainer.className = "order-filter-container";

  // Define the statuses and count orders for each status
  const statuses = ["All", "Process", "Ready", "Pending", "Cancelled"];
  const statusCounts = {
    Ready: orders.filter(order => order.status.toLowerCase() === "ready")
      .length,
    Process: orders.filter(order => order.status.toLowerCase() === "process")
      .length,
    Pending: orders.filter(order => order.status.toLowerCase() === "pending")
      .length,
    Cancelled: orders.filter(
      order => order.status.toLowerCase() === "cancelled"
    ).length,
    All: orders.length
  };

  statuses.forEach(status => {
    const button = document.createElement("button");
    button.textContent = `${status} (${statusCounts[status]})`; // Display the count in the button
    button.className = `filter-button filter-${status.toLowerCase()}`; // Assign unique class based on status
  
    // Event listener to filter orders based on status
    button.addEventListener("click", () => {
      // document
      //   .querySelectorAll(".filter-button")
      //   .forEach(btn => btn.classList.remove("active"));
  
      // button.classList.add("active");
  
      const { toggleLoadingSpinner } = renderLoadingSpinner();
      toggleLoadingSpinner(true);
  
      setTimeout(() => {
        const filteredOrders =
          status === "All"
            ? orders
            : orders.filter(order => order.status.toLowerCase() === status.toLowerCase());
        displayOrders(filteredOrders, orderListElement);
        toggleLoadingSpinner(false);
      }, 2000);
    });
  
    filterContainer.appendChild(button);
  });
  

  // Append the filter buttons to the DOM (at the top of the order list)
  orderListElement.parentElement.insertBefore(
    filterContainer,
    orderListElement
  );

  // Display all orders initially
  displayOrders(orders, orderListElement);
};
