import { createWebSocket } from '../hooks/useWebSocket.js';
import { renderOrderItem } from './OrderItem.js';
import { fetchOrders, fetchOrderByOrderNumber, updateOrder, deleteOrder } from '../hooks/OrderService.js';

const url = 'ws://localhost:5000'; // Replace with your WebSocket server URL

document.addEventListener('DOMContentLoaded', async () => {
  const orderListElement = document.querySelector('#order-list');
  let orders = [];

  const onMessage = (data) => {
    if (data.type === 'initialData') {
      orders = data.orders;
    } else if (data.type === 'newOrder') {
      orders.push(data.order);
    } else if (data.type === 'updateOrder') {
      const index = orders.findIndex(order => order._id === data.order._id);
      if (index !== -1) {
        orders[index] = data.order;
      }
    } else if (data.type === 'deleteOrder') {
      orders = orders.filter(order => order._id !== data.orderId);
    }
    renderOrders();
  };

  const { socket, closeWebSocket } = createWebSocket(url, onMessage);

  const renderOrders = () => {
    orderListElement.innerHTML = orders.map(renderOrderItem).join('');
  };

  try {
    orders = await fetchOrders();
    renderOrders();
  } catch (error) {
    console.error('Error fetching orders:', error);
  }

  // Example usage of fetching, updating, and deleting orders
  // Uncomment these lines to test the functionality
  /*
  try {
    const order = await fetchOrderByOrderNumber('12345');
    console.log('Fetched order:', order);
  } catch (error) {
    console.error('Error fetching order:', error);
  }

  try {
    const updatedOrder = await updateOrder('order-id', { status: 'Completed' });
    console.log('Updated order:', updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
  }

  try {
    await deleteOrder('order-id');
    console.log('Order deleted');
  } catch (error) {
    console.error('Error deleting order:', error);
  }
  */
});
