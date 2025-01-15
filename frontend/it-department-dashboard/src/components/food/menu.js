import { DEVELOPMENT_SERVER_DOMAIN } from "../../config";
import { renderLoadingSpinner } from "../loading/LoadingSpinner";
import "./menu.css";

const basket = JSON.parse(sessionStorage.getItem("basket")) || [];

/**
 * Creates a menu element with items and their details.
 *
 * @param {Object} menu - The menu object containing menu details.
 * @param {string} menu.name - The name of the menu.
 * @param {Array} menu.items - The list of items in the menu.
 * @param {string} menu._id - The unique identifier for the menu.
 * @returns {HTMLElement} The created menu element.
 */
const createMenuElement = menu => {
  const menuElement = document.createElement("div");
  menuElement.className = "menu-element";
  menuElement.style.display = "block"; // Ensure the menu is visible initially
  const menuTitle = document.createElement("h2");
  menuTitle.className = "menu-title";
  menuTitle.textContent = menu.name;
  menuTitle.addEventListener("click", () => toggleMenu(menuElement, menu));
  menuElement.appendChild(menuTitle);

  const itemsContainer = document.createElement("div");
  itemsContainer.className = "items-container";
  itemsContainer.style.display = "flex";
  menu.items.forEach(item => {
    const itemElement = document.createElement("div");
    itemElement.className = "item-element";
    const itemImage = document.createElement("img");
    itemImage.className = "item-image";
    itemImage.src = item.image_url;
    itemImage.alt = item.alt;
    itemElement.appendChild(itemImage);

    const itemName = document.createElement("h3");
    itemName.className = "item-name";
    itemName.textContent = item.name;
    itemElement.appendChild(itemName);

    const itemStock = document.createElement("p");
    itemStock.className = "item-stock";
    itemStock.textContent = item.in_stock ? "In Stock" : "Out of Stock";
    itemElement.appendChild(itemStock);

    if (item.prices) {
      const itemPrices = document.createElement("div");
      itemPrices.className = "item-prices";
      itemPrices.innerHTML = `
    <p><input type="checkbox" name="size" value="large"> Large: ${item.prices
      .large}</p>
    <p><input type="checkbox" name="size" value="medium"> Medium: ${item.prices
      .medium}</p>
    <p><input type="checkbox" name="size" value="small"> Small: ${item.prices
      .small}</p>
  `;
      itemElement.appendChild(itemPrices);
    } else {
      const itemPrice = document.createElement("p");
      itemPrice.className = "item-price";
      itemPrice.textContent = `Price: ${item.price}`;
      itemElement.appendChild(itemPrice);
    }

    const quantityLabel = document.createElement("label");
    quantityLabel.textContent = "Quantity:";
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.min = "1";
    quantityInput.value = "1";
    quantityInput.className = "quantity-input";
    itemElement.appendChild(quantityLabel);
    itemElement.appendChild(quantityInput);

    const addButton = document.createElement("button");
    addButton.className = "add-button";
    addButton.textContent = "Add to Basket";
    addButton.addEventListener("click", () => {
      const selectedSize = itemElement.querySelector(
        'input[name="size"]:checked'
      );
      if (selectedSize) {
        addToBasket(item, quantityInput.value, selectedSize.value);
      } else {
        addToBasket(item, quantityInput.value);
      }
    });
    itemElement.appendChild(addButton);

    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => openEditDialog(menu._id, item));
    itemElement.appendChild(editButton);

    itemsContainer.appendChild(itemElement);
  });

  menuElement.appendChild(itemsContainer);
  return menuElement;
};

/**
 * Toggles the display of the menu items container between "none" and "flex".
 *
 * @param {HTMLElement} menuElement - The DOM element representing the menu.
 * @param {Object} menu - An object representing the menu (not used in the function).
 */
const toggleMenu = (menuElement, menu) => {
  const itemsContainer = menuElement.querySelector(".items-container");
  itemsContainer.style.display =
    itemsContainer.style.display === "none" ? "flex" : "none";
};

/**
 * Adds an item to the basket with the specified quantity and size.
 *
 * @param {Object} item - The item to be added to the basket.
 * @param {number} quantity - The quantity of the item to be added.
 * @param {string} [size] - The size of the item (optional).
 */
const addToBasket = (item, quantity, size) => {
  let price;
  if (size) {
    price = parseFloat(item.prices[size].replace("R", ""));
  } else {
    price = parseFloat(item.price.replace("R", ""));
  }
  const itemInBasket = {
    ...item,
    quantity: parseInt(quantity, 10),
    size: size || "default",
    totalPrice: price * parseInt(quantity, 10)
  };
  basket.push(itemInBasket);
  sessionStorage.setItem("basket", JSON.stringify(basket));
  renderBasket();
};

/**
 * Renders the basket contents to the DOM.
 * - If the basket container does not exist, it creates one and appends it to the body.
 * - Clears the basket container's inner HTML.
 * - Iterates over the basket items and creates a div for each item with its details.
 * - Adds a remove button to each item that allows the user to remove the item from the basket.
 * - Updates the total price of the items in the basket.
 * - If the basket is empty, removes the basket container from the DOM.
 * - If the basket is not empty, appends the total price element to the basket container.
 */
const renderBasket = () => {
  let basketContainer = document.getElementById("basket");
  if (!basketContainer) {
    basketContainer = document.createElement("div");
    basketContainer.id = "basket";
    document.body.appendChild(basketContainer);
  }
  basketContainer.innerHTML = "";
  let totalPrice = 0;
  basket.forEach((item, index) => {
    const basketItem = document.createElement("div");
    basketItem.className = "basket-item";
    basketItem.innerHTML = `
      <h3>${item.name}</h3>
      <p>Quantity: ${item.quantity}</p>
      <p>Total Price: ${item.totalPrice}</p>
      <button class="remove-button">Remove</button>
    `;
    basketContainer.appendChild(basketItem);

    const removeButton = basketItem.querySelector(".remove-button");
    removeButton.addEventListener("click", () => {
      basket.splice(index, 1);
      sessionStorage.setItem("basket", JSON.stringify(basket));
      renderBasket();
    });

    totalPrice += item.totalPrice;
  });

  if (basket.length === 0) {
    document.body.removeChild(basketContainer);
  } else {
    const totalPriceElement = document.createElement("div");
    totalPriceElement.className = "total-price";
    totalPriceElement.textContent = `Total Price: ${totalPrice}`;
    basketContainer.appendChild(totalPriceElement);
  }
};

/**
 * Opens a dialog to edit a menu item.
 *
 * @param {string} menuId - The ID of the menu.
 * @param {Object} item - The item to be edited.
 * @param {boolean} item.in_stock - Indicates if the item is in stock.
 * @param {Object} [item.prices] - The prices of the item, if applicable.
 * @param {string} item.prices.large - The large size price of the item.
 * @param {string} item.prices.medium - The medium size price of the item.
 * @param {string} item.prices.small - The small size price of the item.
 * @param {string} [item.price] - The price of the item, if applicable.
 * @param {string} item._id - The ID of the item.
 */
const openEditDialog = (menuId, item) => {
  const dialog = document.createElement("div");
  dialog.className = "edit-dialog";
  dialog.innerHTML = `
    <form class="edit-form">
      <h2>Edit Item</h2>
      <label>
        In Stock:
        <input type="checkbox" name="in_stock" ${item.in_stock
          ? "checked"
          : ""} />
      </label>
      ${item.prices
        ? `
        <label>
          Large Price:
          <input type="number" name="large_price" value="${parseFloat(
            item.prices.large.replace("R", "")
          )}" />
        </label>
        <label>
          Medium Price:
          <input type="number" name="medium_price" value="${parseFloat(
            item.prices.medium.replace("R", "")
          )}" />
        </label>
        <label>
          Small Price:
          <input type="number" name="small_price" value="${parseFloat(
            item.prices.small.replace("R", "")
          )}" />
        </label>
      `
        : `
        <label>
          Price:
          <input type="number" name="price" value="${parseFloat(
            item.price.replace("R", "")
          )}" />
        </label>
      `}
      <button type="submit">Save</button>
      <button type="button" class="cancel-button">Cancel</button>
    </form>
  `;
  document.body.appendChild(dialog);

  const form = dialog.querySelector(".edit-form");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const formData = new FormData(form);
    item.in_stock = formData.get("in_stock") === "on";
    if (item.prices) {
      item.prices.large = `R${parseFloat(formData.get("large_price"))}`;
      item.prices.medium = `R${parseFloat(formData.get("medium_price"))}`;
      item.prices.small = `R${parseFloat(formData.get("small_price"))}`;
    } else {
      item.price = `R${parseFloat(formData.get("price"))}`;
    }
    document.body.removeChild(dialog);
    console.log("Updated item:", item);

    const { toggleLoadingSpinner } = renderLoadingSpinner();
    toggleLoadingSpinner(true);

    const url = `${DEVELOPMENT_SERVER_DOMAIN}/menus/${menuId}/items/${item._id}`;
    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("cookId");
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Username": username
      },
      body: JSON.stringify(item)
    });
    setTimeout(() => {
      toggleLoadingSpinner(false);
    }, 5000);
    if (!response.ok) {
      console.error("Failed to update item");
    }
  });

  const cancelButton = dialog.querySelector(".cancel-button");
  cancelButton.addEventListener("click", () => {
    document.body.removeChild(dialog);
  });
};

const menuContainer = document.getElementById("menu");

export { createMenuElement, toggleMenu };
