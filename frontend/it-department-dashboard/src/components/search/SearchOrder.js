import { fetchOrders } from "../../hooks/OrderService";
import { createCustomAlert } from "../alert/CustomAlert";

import "./search.css";

/***
 * @description Function to create and append the search component to the document body.
 */
export function createSearchComponent() {
  // Check if the search component already exists to prevent duplicates
  if (document.getElementById("search-container")) return;

  const container = document.createElement("div");
  container.id = "search-container";

  // Create search options
  const searchOptions = ["Order Number", "Name", "Phone"];

  const select = document.createElement("select");
  select.id = "search-option";

  searchOptions.forEach(option => {
    const opt = document.createElement("option");
    opt.value = option.toLowerCase().replace(" ", "");
    opt.text = option;
    select.appendChild(opt);
  });

  // Create search input
  const input = document.createElement("input");
  input.id = "search-input";
  input.type = "text";

  // Create search button
  const button = document.createElement("button");
  button.innerText = "Search";
  button.onclick = handleSearch;

  // Append elements to container
  container.appendChild(select);
  container.appendChild(input);
  container.appendChild(button);

  // Append container to body
  document.body.appendChild(container);
}

// Function to handle the search action
async function handleSearch() {
  const option = document.getElementById("search-option").value;
  const input = document.getElementById("search-input").value;

  if (!option) {
    createCustomAlert("No option is selected !", false);
    return;
  } else if (!input) {
    createCustomAlert(`No ${option} entered !`, false);
  } else if (["ordernumber", "phone"].includes(option) && isNaN(input)) {
    createCustomAlert("The input must be a number", false);
    return;
  } else {
    // Fetch orders and handle the response
    try {
      const orders = await fetchOrders();
      console.log(orders);
      const matches = orders.filter(order => {
        console.log(option);
        console.log(input);
        for (const key in order) {
          // Clean the key (remove spaces and convert to lowercase)
          const cleanedKey = key.replace(/\s+/g, "").toLowerCase();
          // If the cleaned key matches the constant key
          if (cleanedKey === option) {
            // Get the value of the key, trim spaces
            const value = order[key].toString().toLowerCase().trim();

            // If the value matches the constant value, return true
            if (value === input.toString().toLowerCase().trim()) {
              return true;
            }
          }
        }
        // Return false if no match is found
        return false;
      });

      console.log(matches);
      if (orders.message) {
        showCustomerAlert(orders.message);
      } else {
        if (matches.length > 0) {
          console.log("Orders:", matches);
        } else {
          showCustomerAlert(`No orders found matching ${option}: ${input}`);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }
}

// Function to show a custom alert message
function showCustomerAlert(message) {
  createCustomAlert(message, false);
}
