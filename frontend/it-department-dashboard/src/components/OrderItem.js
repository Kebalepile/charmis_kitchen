import { updateOrder, deleteOrder } from "../hooks/OrderService.js";

/**
 * @description Renders a single order item.
 * 
 * @param {Object} order - The order object to render.
 * @returns {HTMLElement} The DOM element for the order item.
 */
export const renderOrderItem = order => {
  const formattedTimestamp = new Date(order.timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const article = document.createElement("article");
  article.className = "order-item";

  const h3 = document.createElement("h3");
  h3.textContent = `Order Number: ${order.orderNumber}`;
  article.appendChild(h3);

  const details = [
    `Name: ${order.name}`,
    `Phone: ${order.phone}`,
    `Street Address: ${order.streetAddress}`,
    `House Number: ${order.houseNumber}`,
    `Payment Method: ${order.paymentMethod}`,
    `Payment Total: R${order.paymentTotal}`,
    `Delivery Charge: R${order.deliveryCharge}`,
    `Payment Items: ${order.paymentItemsDescriptions}`,
    `Timestamp: ${formattedTimestamp}`
  ];

  details.forEach(detail => {
    const p = document.createElement("p");
    p.textContent = detail;
    article.appendChild(p);
  });

  const fulfilledButton = document.createElement("button");
  fulfilledButton.className = "order-button";
  fulfilledButton.textContent = "Order Fulfilled";
  fulfilledButton.onclick = async () => {
    try {
      await updateOrder(order._id, { status: "Order Fulfilled" });
      // console.log("Order Fulfilled clicked");
      order.status = "Order Fulfilled";
      pStatus.textContent = `Status: ${order.status}`;

      deleteOrder(order._id);
      
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };
  article.appendChild(fulfilledButton);

  if (order.deliveryCharge > 0) {
    const deliverButton = document.createElement("button");
    deliverButton.className = "order-button";
    deliverButton.textContent = "Order Deliver";
    deliverButton.onclick = async () => {
      try {
        await updateOrder(order._id, { status: "Order Out on Delivery" });
        // console.log("Order Deliver clicked");
        order.status = "Order Out on Delivery";
        pStatus.textContent = `Status: ${order.status}`;
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    };
    article.appendChild(deliverButton);
  } else {
    const collectButton = document.createElement("button");
    collectButton.className = "order-button";
    collectButton.textContent = "Order Collect";
    collectButton.onclick = async () => {
      try {
        await updateOrder(order._id, { status: "Ready for Collection" });
        // console.log("Order Collect clicked");
        order.status = "Ready for Collection";
        pStatus.textContent = `Status: ${order.status}`;
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    };
    article.appendChild(collectButton);
  }

  const resetButton = document.createElement("button");
  resetButton.className = "order-button";
  resetButton.textContent = "Reset Order";
  resetButton.onclick = async () => {
    try {
      await updateOrder(order._id, { status: "Pending" });
      // console.log("Reset Order clicked");
      order.status = "Pending";
      pStatus.textContent = `Status: ${order.status}`;
    } catch (error) {
      console.error("Failed to reset order status:", error);
    }
  };
  article.appendChild(resetButton);

  const pStatus = document.createElement("p");
  pStatus.className = "status-text";
  pStatus.textContent = `Status: ${order.status}`;
  article.appendChild(pStatus);

  return article;
};
