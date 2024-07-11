export const updateOrderStats = (orders, orderStatsElement) => {
  const pendingOrdersCount = orders.filter(order => order.status === "Pending").length;

  orderStatsElement.textContent = ''; // Clear previous content
  const p = document.createElement('p');
  p.textContent = `Total Pending Orders: ${pendingOrdersCount}`;
  orderStatsElement.appendChild(p);
};
