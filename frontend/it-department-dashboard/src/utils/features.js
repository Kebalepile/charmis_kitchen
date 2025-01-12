import { renderLoadingSpinner } from "../components/loading/LoadingSpinner";
import { DEVELOPEMT_SERVER_DOMAIN } from "../config";
import { createButton } from "./buttonUtils";
import { hasSpecialPrivilege, signup } from "../hooks/Authentication";
import {
  fetchOrders,
  fetchOrderByOrderNumber,
  updateOrder
} from "../hooks/OrderService";

const getMenus = async () => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${DEVELOPEMT_SERVER_DOMAIN}/menus`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to get menus list");
  }
  return response.json();
};

const searchOrder = async argument => {
  if (!argument) {
    return "No argument provided";
  }

  if (argument === "all") {
    const orders = await fetchOrders();
    return orders.reverse();
  }

  if (/^\d{10}$/.test(argument)) {
    const orders = await fetchOrders();
    const filteredOrders = orders.filter(order => order.phone === argument);
    if (filteredOrders.length > 0) {
      return filteredOrders;
    }
  }

  const order = await fetchOrderByOrderNumber(argument);
  if (order) {
    return order;
  }

  return "Order not found";
};

const getVendorList = async () => {
  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");
  const response = await fetch(`${DEVELOPEMT_SERVER_DOMAIN}/vendors`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Username": username
    }
  });
  if (!response.ok) {
    throw new Error("Failed to get vendor list");
  }
  return response.json();
};

const populateDatabase = async () => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${DEVELOPEMT_SERVER_DOMAIN}/menus/populate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to populate database");
  }
};

const functionWrapper = async (func, isAsync = false) => {
  const { toggleLoadingSpinner } = renderLoadingSpinner();
  toggleLoadingSpinner(true);
  let result;
  try {
    if (isAsync) {
      result = await func();
    } else {
      result = func();
    }
  } finally {
    setTimeout(() => {
      toggleLoadingSpinner(false);
    }, 5000);
  }
  return result;
};

export async function checkPrivilages() {
  const hasPrivilege = await hasSpecialPrivilege();
  if (hasPrivilege) {
    const header = document.querySelector(".header-nav");
    const specialSection = document.createElement("div");
    specialSection.className = "special-section";

    const buttons = [
      "Populate Database",
      "Vendor List",
      "Create New Vendor Acc",
      "Search Order",
      "Get Menus",
      "Edit Order"
    ];

    buttons.forEach(buttonText => {
      const button = createButton(buttonText);
      switch (buttonText) {
        case "Populate Database":
          button.onclick = () => {
            console.log("populating database");
            functionWrapper(populateDatabase, true);
          };
          break;
        case "Vendor List":
          button.onclick = async () => {
            console.log("getting vendor list");
            const res = await functionWrapper(getVendorList, true);
            console.log(res);
          };
          break;
        case "Search Order":
          button.onclick = async () => {
            let argument = prompt(
              "Enter 'all' to fetch all orders, a 10-digit phone number, or an order number:"
            ).trim();
            if (argument) {
              console.log(`searching order with argument: ${argument}`);
              const result = await functionWrapper(
                () => searchOrder(argument),
                true
              );
              console.log(result);
            } else {
              console.log("No valid argument provided");
            }
          };
          break;

        case "Get Menus":
          button.onclick = async () => {
            console.log(`${buttonText} button clicked`);
            const res = await functionWrapper(getMenus, true);
            console.log(res);
          };

          break;
        case "Create New Vendor Acc":
          button.onclick = () => {
            const form = document.createElement("form");
            form.className = "vendor-form";

            const usernameLabel = document.createElement("label");
            usernameLabel.textContent = "Enter Username:";
            form.appendChild(usernameLabel);

            const usernameInput = document.createElement("input");
            usernameInput.type = "text";
            usernameInput.name = "username";
            form.appendChild(usernameInput);

            const createButton = document.createElement("button");
            createButton.type = "button";
            createButton.textContent = "Create Acc";
            form.appendChild(createButton);

            const cancelButton = document.createElement("button");
            cancelButton.type = "button";
            cancelButton.textContent = "Cancel";
            form.appendChild(cancelButton);

            const messageDiv = document.createElement("div");
            messageDiv.className = "message";
            form.appendChild(messageDiv);

            createButton.onclick = async () => {
              const username = usernameInput.value.trim();
              if (username) {
                const { toggleLoadingSpinner } = renderLoadingSpinner();
                toggleLoadingSpinner(true);
                const response = await signup(username);
                setTimeout(() => {
                  toggleLoadingSpinner(false);
                }, 5000);
                messageDiv.innerHTML = `
                  <p>New vendor account created</p>
                  <p>Login details:</p>
                  <p>Username: <span id="username">${response.username}</span> <button id="copy-username">Copy</button></p>
                  <p>PIN: <span id="pin">${response.pin}</span> <button id="copy-pin">Copy</button></p>
                `;

                document.getElementById("copy-username").onclick = () => {
                  navigator.clipboard.writeText(response.username);
                };
                document.getElementById("copy-pin").onclick = () => {
                  navigator.clipboard.writeText(response.pin);
                };
              }
            };

            cancelButton.onclick = () => {
              form.remove();
            };

            document.body.appendChild(form);
          };
        case "Edit Order":
          button.onclick = () => console.log(`${buttonText} button clicked`);
          break;
        default:
          break;
      }

      specialSection.appendChild(button);
    });

    header.appendChild(specialSection);
  }
}
