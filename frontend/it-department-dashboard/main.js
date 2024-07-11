import './styles/style.css';
import './src/components/OrderList.js';

const app = document.querySelector('#app');

const container = document.createElement('div');

const header = document.createElement('h1');
header.textContent = 'Boitekong Eats IT Dashboard';

const hr = document.createElement('hr');

const card = document.createElement('div');
card.className = 'card';

const orderList = document.createElement('ul');
orderList.id = 'order-list';

card.appendChild(orderList);

container.appendChild(header);
container.appendChild(hr);
container.appendChild(card);

app.appendChild(container);
