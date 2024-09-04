import { renderOrderItem } from "../orderItem/OrderItem.js";
/**
 * @description Display orders placed, waiting to be fulfiled or cancelled
 * @param {array } orders 
 * @param {HTMLElement} orderListElement
 */
export const displayOrders = (orders, orderListElement) => {
    orderListElement.innerHTML = "";
    orders.forEach(order => {
      const orderItemElement = renderOrderItem(order);
      orderListElement.appendChild(orderItemElement);
    });
  };