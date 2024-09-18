import { fetchOrders } from "../../hooks/OrderService";
import { createCustomAlert } from "../alert/CustomAlert";
import "./search.css";

/***
 * @description Function to create and append the search component to the document body.
 */
export function createSearchComponent() {
  if (document.getElementById("search-container")) return;

  const container = document.createElement("div");
  container.id = "search-container";

  const searchOptions = ["Order Number", "Name", "Phone"];

  const select = document.createElement("select");
  select.id = "search-option";

  searchOptions.forEach(option => {
    const opt = document.createElement("option");
    opt.value = option.toLowerCase().replace(" ", "");
    opt.text = option;
    select.appendChild(opt);
  });

  const input = document.createElement("input");
  input.id = "search-input";
  input.type = "text";

  const button = document.createElement("button");
  button.innerText = "Search";
  button.onclick = handleSearch;

  const closeButton = document.createElement("button");
  closeButton.innerText = "Close";
  closeButton.id = "search-close-btn";
  closeButton.onclick = removeSearchComponent;

  // Append elements to container
  container.appendChild(select);
  container.appendChild(input);
  container.appendChild(button);
  container.appendChild(closeButton);

  // Create and append the result container for displaying matched orders
  const resultContainer = document.createElement("div");
  resultContainer.id = "result-container";
  container.appendChild(resultContainer); // Append the result container to the main container

  document.body.appendChild(container);
}

function removeSearchComponent() {
  const container = document.getElementById("search-container");
  if (container) {
    container.remove();
    location.reload();
  }
}

// Function to render the matched orders
function displayMatchedOrders(matches) {
  const resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = ""; // Clear previous results if any

  if (matches.length === 0) {
    resultContainer.innerHTML = "<p>No matching orders found</p>";
    return;
  }

  matches.forEach(order => {
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    orderCard.innerHTML = `
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Name:</strong> ${order.name}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Address:</strong> ${order.houseNumber}, ${order.streetAddress}</p>
      <p><strong>Items:</strong> ${order.paymentItemsDescriptions}</p>
      <p><strong>Total Payment:</strong> R${order.paymentTotal}</p>
      <p><strong>Status:</strong> ${order.status}</p>
    `;

    resultContainer.appendChild(orderCard);
  });
}

async function handleSearch() {
  const option = document.getElementById("search-option").value;
  const input = document.getElementById("search-input").value;

  if (!option) {
    createCustomAlert("No option is selected!", false);
    return;
  } else if (!input) {
    createCustomAlert(`No ${option} entered!`, false);
  } else if (["ordernumber", "phone"].includes(option) && isNaN(input)) {
    createCustomAlert("The input must be a number", false);
    return;
  } else {
    try {
      const orders = await fetchOrders();
      const matches = orders.filter(order => {
        for (const key in order) {
          const cleanedKey = key.replace(/\s+/g, "").toLowerCase();
          if (cleanedKey === option) {
            const value = order[key].toString().toLowerCase().trim();
            if (value === input.toString().toLowerCase().trim()) {
              return true;
            }
          }
        }
        return false;
      });

      const resultContainer = document.getElementById("result-container");
      if (matches.length > 0) {
        displayMatchedOrders(matches);
      } else {
        const formattedOption = option === "ordernumber" ? "order number" : option;
        resultContainer.innerHTML = `<p>No order(s) found matching ${formattedOption}: ${input}</p>`;
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }
}
