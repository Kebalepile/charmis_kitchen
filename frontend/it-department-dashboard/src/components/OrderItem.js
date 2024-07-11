/**
 * Renders a single order item.
 * 
 * @param {Object} order - The order object to render.
 * @returns {string} The HTML string for the order item.
 */
export const renderOrderItem = (order) => {
    return `
      <li>
        <h3>Order Number: ${order.orderNumber}</h3>
        <p>Name: ${order.name}</p>
        <p>Phone: ${order.phone}</p>
        <p>Address: ${order.streetAddress} ${order.houseNumber}</p>
        <p>Payment Method: ${order.paymentMethod}</p>
        <p>Total: ${order.paymentTotal}</p>
      </li>
    `;
  };
  