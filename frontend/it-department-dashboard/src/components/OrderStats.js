import "../../styles/order.css"

export const updateOrderStats = (orders, orderStatsElement) => {
  const pendingOrdersCount = orders.filter(order => order.status === "Pending").length;

  orderStatsElement.textContent = ''; // Clear previous content
  const p = document.createElement('p');
  p.textContent = `Total Pending Orders: ${pendingOrdersCount}`;
  p.classList.add("pending-orders")
  orderStatsElement.appendChild(p);
};
