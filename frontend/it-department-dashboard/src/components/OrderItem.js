import {updateOrder, deleteOrder} from "../hooks/OrderService"

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
    { label: "Name", value: order.name, className: "order-detail-name" },
    { label: "Phone", value: order.phone, className: "order-detail-phone" },
    {
      label: "Street Address",
      value: order.streetAddress,
      className: "order-detail-address"
    },
    {
      label: "House Number",
      value: order.houseNumber,
      className: "order-detail-house-number"
    },
    {
      label: "Payment Method",
      value: order.paymentMethod,
      className: "order-detail-payment-method"
    },

    {
      label: "Delivery Charge",
      value: `R${order.deliveryCharge}.00`,
      className: "order-detail-delivery-charge"
    },
    {
      label: "Payment Items",
      value: order.paymentItemsDescriptions,
      className: "order-detail-payment-items"
    },
    {
      label: "Timestamp",
      value: formattedTimestamp,
      className: "order-detail-timestamp"
    },
    {
      label: "Payment Total",
      value: `R${order.paymentTotal}.00`,
      className: "order-detail-payment-total"
    }
  ];

  details.forEach(detail => {
    const p = document.createElement("p");
    p.textContent = `${detail.label}: ${detail.value}`;
    p.className = `order-detail ${detail.className}`; // Assigning common class 'order-detail' and specific class
    article.appendChild(p);
  });

  const fulfilledButton = document.createElement("button");
  fulfilledButton.className = "order-button fulfilled-button"; // Add classes for buttons
  fulfilledButton.textContent = "Order Fulfilled";
  fulfilledButton.onclick = async () => {
    try {
      await updateOrder(order._id, { status: "Order Fulfilled" });
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
    deliverButton.className = "order-button deliver-button"; // Add classes for buttons
    deliverButton.textContent = "Order Deliver";
    deliverButton.onclick = async () => {
      try {
        await updateOrder(order._id, { status: "Order Out on Delivery" });
        order.status = "Order Out on Delivery";
        pStatus.textContent = `Status: ${order.status}`;
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    };
    article.appendChild(deliverButton);
  } else {
    const collectButton = document.createElement("button");
    collectButton.className = "order-button collect-button"; // Add classes for buttons
    collectButton.textContent = "Order Collect";
    collectButton.onclick = async () => {
      try {
        await updateOrder(order._id, { status: "Ready for Collection" });
        order.status = "Ready for Collection";
        pStatus.textContent = `Status: ${order.status}`;
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    };
    article.appendChild(collectButton);
  }

  const resetButton = document.createElement("button");
  resetButton.className = "order-button reset-button"; // Add classes for buttons
  resetButton.textContent = "Reset Order";
  resetButton.onclick = async () => {
    try {
      await updateOrder(order._id, { status: "Pending" });
      order.status = "Pending";
      pStatus.textContent = `Status: ${order.status}`;
    } catch (error) {
      console.error("Failed to reset order status:", error);
    }
  };
  article.appendChild(resetButton);

  const pStatus = document.createElement("p");
  pStatus.className = "status-text"; // Add class for status text
  pStatus.textContent = `Status: ${order.status}`;
  article.appendChild(pStatus);

  return article;
};
