export const renderOrderItem = (order) => {
  console.log(order);

  // Use createdAt for the timestamp
  const formattedTimestamp = new Date(order.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
      className: "order-detail-address",
    },
    {
      label: "House Number",
      value: order.houseNumber,
      className: "order-detail-house-number",
    },
    {
      label: "Payment Method",
      value: order.paymentMethod,
      className: "order-detail-payment-method",
    },
    {
      label: "Delivery Charge",
      value: `R${order.deliveryCharge}.00`,
      className: "order-detail-delivery-charge",
    },
    {
      label: "Payment Items",
      value: order.paymentItemsDescriptions,
      className: "order-detail-payment-items",
    },
    {
      label: "Timestamp",
      value: formattedTimestamp,
      className: "order-detail-timestamp",
    },
    {
      label: "Payment Total",
      value: `R${order.paymentTotal}.00`,
      className: "order-detail-payment-total",
    },
    {
      label: "Chef",
      value: order.cookId.join(", "), // Displaying cookId array as a comma-separated string
      className: "order-detail-cook-id",
    },
  ];

  details.forEach((detail) => {
    const p = document.createElement("p");
    p.textContent = `${detail.label}: ${detail.value}`;
    p.className = `order-detail ${detail.className}`;
    article.appendChild(p);
  });

  const pStatus = document.createElement("p");
  pStatus.className = "status-text";
  pStatus.textContent = `Status: ${order.status}`;
  article.appendChild(pStatus);
  
  // Button for deleting the order
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Order";
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", () => {
    // Logic for deleting the order goes here
    console.log(`Deleting order: ${order.orderNumber}`);
  });
  article.appendChild(deleteButton);

  // Button for editing the order
  const editButton = document.createElement("button");
  editButton.textContent = "Edit Order";
  editButton.className = "edit-button";
  editButton.addEventListener("click", () => {
    // Logic for editing the order goes here
    console.log(`Editing order: ${order.orderNumber}`);
  });
  article.appendChild(editButton);

  

  return article;
};
