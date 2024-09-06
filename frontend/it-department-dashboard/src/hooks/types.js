/**
 * @typedef {Object} Order
 * @property {string} orderNumber - The order number.
 * @property {string} name - The name of the person who placed the order.
 * @property {string} phone - The phone number of the person who placed the order.
 * @property {string} streetAddress - The street address for delivery.
 * @property {string} houseNumber - The house number for delivery.
 * @property {string} paymentMethod - The payment method used.
 * @property {number} paymentTotal - The total payment amount.
 * @property {number} deliveryCharge - The delivery charge.
 * @property {string} paymentItemsDescriptions - The descriptions of the payment items.
 * @property {string} status - The status of the order.
 * @property {Date} timestamp - The timestamp of the order.
 * @property {string} WebSocketURL - The WebSocket server URL.
 * @property {string} ServerDomain - The web service API URL.
 */

export const ORDER_NUMBER = 'orderNumber';
export const NAME = 'name';
export const PHONE = 'phone';
export const STREET_ADDRESS = 'streetAddress';
export const HOUSE_NUMBER = 'houseNumber';
export const PAYMENT_METHOD = 'paymentMethod';
export const PAYMENT_TOTAL = 'paymentTotal';
export const DELIVERY_CHARGE = 'deliveryCharge';
export const PAYMENT_ITEMS_DESCRIPTIONS = 'paymentItemsDescriptions';
export const STATUS = 'status';
export const TIMESTAMP = 'timestamp';
// export const WEBSOCKET_URL = 'ws://localhost:5000';
// export const SERVER_DOMAIN = 'http://localhost:5000';
export const WEBSOCKET_URL = "wss://b-town-bites.onrender.com"
export const SERVER_DOMAIN = 'https://b-town-bites.onrender.com'
