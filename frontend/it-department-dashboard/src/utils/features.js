import { renderLoadingSpinner } from "../components/loading/LoadingSpinner";
import { DEVELOPMENT_SERVER_DOMAIN } from "../config";
import { createButton } from "./buttonUtils";
import { hasSpecialPrivilege } from "../hooks/Authentication";
import { createMenuElement, toggleMenu } from "../components/food/menu";
import { RenderOrders } from "../components/orders/orderDetails";
import { CreateVendorAccount } from "../components/accounts/vendorAccount";

const getMenus = async () => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${DEVELOPMENT_SERVER_DOMAIN}/menus`, {
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

const fetchOrders = async () => {
  const cookId = sessionStorage.getItem("cookId");
  const token = sessionStorage.getItem("token");
  const url = new URL(`${DEVELOPMENT_SERVER_DOMAIN}/orders`);

  url.searchParams.append("cookId", cookId);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { error: errorData.message || "An error occurred" };
  }

  let orders = await response.json();
  orders = orders.reverse();
  return orders;
};
const searchOrder = async argument => {
  if (!argument) {
    return "No argument provided";
  }
  let orders = await fetchOrders();

  // if (argument === "all") {
  //   return orders;
  // }

  if (/^\d{10}$/.test(argument)) {
    const filteredOrders = orders.filter(order => order.phone === argument);
    if (filteredOrders.length > 0) {
      return filteredOrders;
    }
  }

  const order = orders.filter(order => order.orderNumber === argument);
  // filter using ordernumber as argument
  if (order) {
    return order;
  }

  return "Order not found";
};

const getVendorList = async () => {
  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("cookId");
  const response = await fetch(`${DEVELOPMENT_SERVER_DOMAIN}/vendors`, {
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
  const response = await fetch(`${DEVELOPMENT_SERVER_DOMAIN}/menus/populate`, {
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
    }, 2000);
  }
  return result;
};

const handleSearchOrder = async () => {
  cleanUIUX();
  let argument = prompt(
    "Enter a 10-digit phone number, or an order number:"
  ).trim();
  if (argument) {
    const results = await functionWrapper(() => searchOrder(argument), true);

    results.length ? RenderOrders(results) : alert("Order not found");
  } else {
    console.log("No valid argument provided");
  }
};

const handlePopulateDatabase = () => {
  functionWrapper(populateDatabase, true);
};

const handleVendorList = async () => {
  const res = await functionWrapper(getVendorList, true);
  console.log(res);
};

const handleGetMenus = async () => {
  cleanUIUX();
  const existingMenuContainer = document.querySelector(".food-menu-container");
  if (existingMenuContainer) {
    // console.log("Menu container already exists");
    return;
  }
  const res = await functionWrapper(getMenus, true);
  // console.log(res);
  if (Array.isArray(res) && res.length > 0) {
    const menuContainer = document.createElement("div");
    menuContainer.className = "food-menu-container component";
    res.forEach(menu => {
      const menuElement = createMenuElement(menu);
      menuContainer.appendChild(menuElement);
    });
    document.body.appendChild(menuContainer);
    toggleMenu(menuContainer);
  } else {
    alert("No menus available");
  }

  // create html componet that is toggelable to display these menus and add assets folder where
  // images of relevant menus will be found.
  // these menus should have be selectable and there must be a checkout basket
  // and payment form that will be used to generate payment link form payfast
  // or yoco payment gateway.
};
const handleCreateVendorAccount = () => {
  cleanUIUX();
  CreateVendorAccount();
};

const handleReadAllOrders = async () => {
  cleanUIUX();
  const orders = await fetchOrders();
  orders.length ? RenderOrders(orders) : alert("No orders found");
};

const cleanUIUX = () => {
  const components = document.querySelectorAll(".component");
  components.forEach(component => component.remove());
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
      "Read Orders"
    ];

    buttons.forEach(buttonText => {
      const button = createButton(buttonText);
      switch (buttonText) {
        case "Populate Database":
          button.onclick = handlePopulateDatabase;
          break;
        case "Vendor List":
          button.onclick = handleVendorList;
          break;
        case "Search Order":
          button.onclick = handleSearchOrder;
          break;
        case "Get Menus":
          button.onclick = handleGetMenus;
          break;
        case "Create New Vendor Acc":
          button.onclick = handleCreateVendorAccount;
          break;
        case "Read Orders":
          button.onclick = handleReadAllOrders;
          break;
        default:
          break;
      }

      specialSection.appendChild(button);
    });

    header.appendChild(specialSection);
  }
}
