import "./styles/App.css";
import "./src/components/App.js"

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

const header = createElement("h1", {
  textContent: " Boitekong Eats IT Dashboard"
});

// Create the logo image element
const logo = createElement("img", {
  src: "/1.png",
  alt: "Boitekong Eats Logo",
  className: "logo"
});

// Append the logo to the header
header.prepend(logo);

const hr = createElement("hr");

const card = createSection("card");

const orderList = createSection();
orderList.id = "order-list";

const orderStats = createSection();
orderStats.id = "order-stats";

card.appendChild(orderList);
container.append(header, hr, orderStats, card);

app.appendChild(container);
