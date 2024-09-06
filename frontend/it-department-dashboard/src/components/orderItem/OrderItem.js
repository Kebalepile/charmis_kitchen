import { updateOrder } from "../../hooks/OrderService";
import "./order.css";

/**
 * Function to handle status updates for an order item.
 * @param {Object} order - The order object containing order details.
 * @param {string} newStatus - The new status to update the order to.
 */
const handleStatusUpdate = async (order, newStatus) => {
  try {
    const id = order["_id"];
    const update = {
      ...order,
      status: newStatus
    };
    const res = await updateOrder(id, update);
    if (newStatus === "Ready") {
      alert(
        `Order ready & notification via SMS is sent to the customer at ${res.phone}`
      );
    }
    console.log(res);
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

/**
 * Function to render an order item in the DOM with dynamic status buttons.
 * @param {Object} order - The order object containing order details.
 * @returns {HTMLElement} - The rendered order item element.
 */
export const renderOrderItem = order => {
  const formattedTimestamp = new Date(order.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const article = document.createElement("article");
  article.className = "order-item";

  // Order details
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
    },
    {
      label: "Chef",
      value: order.cookId.join(", "),
      className: "order-detail-cook-id"
    } // Display cookId as comma-separated
  ];

  details.forEach(detail => {
    const p = document.createElement("p");
    p.textContent = `${detail.label}: ${detail.value}`;
    p.className = `order-detail ${detail.className}`;
    article.appendChild(p);
  });

  // Order status
  const pStatus = document.createElement("p");
  pStatus.className = "status-text";
  pStatus.textContent = `Status: ${order.status}`;
  article.appendChild(pStatus);

  // Conditionally rendering buttons based on order status
  if (order.status === "Pending") {
    const processButton = document.createElement("button");
    processButton.textContent = "Move to Process";
    processButton.className = "process-button";
    processButton.addEventListener("click", () =>
      handleStatusUpdate(order, "Process")
    );
    article.appendChild(processButton);
  }

  if (order.status === "Process") {
    const fulfillButton = document.createElement("button");
    fulfillButton.textContent = "Fulfill Order";
    fulfillButton.className = "fulfill-button";
    fulfillButton.addEventListener("click", () =>
      handleStatusUpdate(order, "Ready")
    );
    article.appendChild(fulfillButton);
  }

  if (order.status === "Cancelled") {
    const reinstatePendingButton = document.createElement("button");
    reinstatePendingButton.textContent = "Reinstate to Pending";
    reinstatePendingButton.className = "reinstate-pending-button";
    reinstatePendingButton.addEventListener("click", () =>
      handleStatusUpdate(order, "Pending")
    );
    article.appendChild(reinstatePendingButton);

    const reinstateProcessButton = document.createElement("button");
    reinstateProcessButton.textContent = "Reinstate to Process";
    reinstateProcessButton.className = "reinstate-process-button";
    reinstateProcessButton.addEventListener("click", () =>
      handleStatusUpdate(order, "Process")
    );
    article.appendChild(reinstateProcessButton);
  }

  // Cancel button (visible unless order is Ready)
  if (order.status !== "Ready" && order.status !== "Cancelled") {
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel Order";
    cancelButton.className = "cancel-button";
    cancelButton.addEventListener("click", () =>
      handleStatusUpdate(order, "Cancelled")
    );
    article.appendChild(cancelButton);
  }

  return article;
};
