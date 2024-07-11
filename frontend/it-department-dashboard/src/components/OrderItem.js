/**
 * Renders a single order item.
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

  const article = document.createElement('article');
  article.className = 'order-item';

  const h3 = document.createElement('h3');
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
    `Status: ${order.status}`,
    `Timestamp: ${formattedTimestamp}`
  ];

  details.forEach(detail => {
    const p = document.createElement('p');
    p.textContent = detail;
    article.appendChild(p);
  });

  return article;
};
