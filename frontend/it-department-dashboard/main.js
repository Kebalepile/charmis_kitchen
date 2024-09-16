import "./styles/App.css";
import "./src/App.js";
import { createHeaderComponent } from "./src/components/header/Header.js"; 

const createElement = (tagName, attributes = {}) => {
  const element = document.createElement(tagName);
  Object.assign(element, attributes);
  return element;
};

const createSection = (className = "") => {
  const section = createElement("section");
  if (className) {
    section.className = className;
  }
  return section;
};

const app = document.querySelector("#app");

const container = createSection();

// Use the Nav component
const header = createHeaderComponent();

const hr = createElement("hr");

const card = createSection("card");

const orderList = createSection();
orderList.id = "order-list";

const orderStats = createSection();
orderStats.id = "order-stats";

card.appendChild(orderList);
container.append(header, hr, orderStats, card);

app.appendChild(container);
