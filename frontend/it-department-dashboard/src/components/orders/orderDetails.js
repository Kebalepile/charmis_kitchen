import { EditOrder } from "./EditOrder";
import "./orderdetails.css";

export const RenderOrders = async orders => {
  let container = document.querySelector(".orders-container");
  const closeOrdersButton = document.createElement("button");
  closeOrdersButton.className = "close-orders-button";
  closeOrdersButton.textContent = "Close Orders";

  closeOrdersButton.onclick = () => {
    if (container) {
      container.remove();
    }
  };

  if (container) {
    container.remove();
  }

  container = document.createElement("div");
  container.className = "orders-container";
  container.appendChild(closeOrdersButton);

  orders.forEach(order => {
    const orderDetailsComponent = OrderDetails(order);

    container.appendChild(orderDetailsComponent);
  });

  document.body.appendChild(container);
};

const OrderDetails = order => {
  let isEditing = false;

  const handleEditClick = () => {
    isEditing = true;
    const container = render();
    return container;
  };

  const handleCloseClick = container => {
    if (container) {
      container.remove();
    }
    const ordersContainer = document.querySelector(".orders-container");
    if (ordersContainer && ordersContainer.children.length === 1) {
      ordersContainer.remove();
    }
  };

  const render = () => {
    // 8355
    const container = document.createElement("div");
    container.className = "order-details";

    if (isEditing) {
      EditOrder(order);
      // container.appendChild(editOrderComponent);
    } else {
      const orderInfo = document.createElement("div");
      orderInfo.className = "order-info";

      const cookId = document.createElement("p");
      cookId.innerHTML = `<strong>Chef(s):</strong> ${order.cookId}`;
      orderInfo.appendChild(cookId);

      const orderNumber = document.createElement("p");
      orderNumber.innerHTML = `<strong>Order Number:</strong> ${order.orderNumber}`;
      orderInfo.appendChild(orderNumber);

      const customerName = document.createElement("p");
      customerName.innerHTML = `<strong>Customer Name:</strong> ${order.name}`;
      orderInfo.appendChild(customerName);

      const phone = document.createElement("p");
      phone.innerHTML = `<strong>Phone:</strong> ${order.phone}`;
      orderInfo.appendChild(phone);

      const streetAddress = document.createElement("p");
      streetAddress.innerHTML = `<strong>Street Address:</strong> ${order.streetAddress}`;
      orderInfo.appendChild(streetAddress);

      const houseNumber = document.createElement("p");
      houseNumber.innerHTML = `<strong>House Number:</strong> ${order.houseNumber}`;
      orderInfo.appendChild(houseNumber);

      const orderDate = document.createElement("p");
      const date = new Date(order.createdAt);
      const formattedDate = date.toISOString().split("T")[0];
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
      orderDate.innerHTML = `<strong>Order Date:</strong> ${formattedDate} <strong>Time:</strong> ${formattedTime}`;
      orderInfo.appendChild(orderDate);

      const paymentItemsDescriptions = document.createElement("p");
      paymentItemsDescriptions.innerHTML = `<strong>Payment Items Descriptions:</strong> ${order.paymentItemsDescriptions}`;
      orderInfo.appendChild(paymentItemsDescriptions);

      const timeEstimation = document.createElement("p");
      timeEstimation.innerHTML = `<strong>Time Estimation:</strong> ${order.timeEstimation}`;
      orderInfo.appendChild(timeEstimation);

      const paymentMethod = document.createElement("p");
      paymentMethod.innerHTML = `<strong>Payment Method:</strong> ${order.paymentMethod}`;
      orderInfo.appendChild(paymentMethod);

      const deliveryCharge = document.createElement("p");
      deliveryCharge.innerHTML = `<strong>Delivery Charge:</strong> R${order.deliveryCharge}`;
      orderInfo.appendChild(deliveryCharge);

      const paymentTotal = document.createElement("p");
      paymentTotal.innerHTML = `<strong>Payment Total:</strong> R${order.paymentTotal}`;
      orderInfo.appendChild(paymentTotal);

      const status = document.createElement("p");
      status.innerHTML = `<strong>Status:</strong> ${order.status}`;
      orderInfo.appendChild(status);

      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "order-details-buttons-container";

      const editButton = document.createElement("button");
      editButton.className = "edit-order-button";
      editButton.textContent = "Edit";
      editButton.onclick = handleEditClick;
      buttonsContainer.appendChild(editButton);

      const closeButton = document.createElement("button");
      closeButton.className = "order-close-button";
      closeButton.textContent = "Close";
      closeButton.onclick = () => handleCloseClick(container);
      buttonsContainer.appendChild(closeButton);

      orderInfo.appendChild(buttonsContainer);

      container.appendChild(orderInfo);
    }

    return container;
  };

  return render();
};
