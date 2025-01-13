import { DEVELOPMENT_SERVER_DOMAIN } from "../../config";
import { renderLoadingSpinner } from "../loading/LoadingSpinner";
import "./menu.css";

const basket = [];

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
                    <p>Large: ${item.prices.large}</p>
                    <p>Medium: ${item.prices.medium}</p>
                    <p>Small: ${item.prices.small}</p>
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
    addButton.addEventListener("click", () =>
      addToBasket(item, quantityInput.value)
    );
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

const toggleMenu = (menuElement, menu) => {
  const itemsContainer = menuElement.querySelector(".items-container");
  itemsContainer.style.display =
    itemsContainer.style.display === "none" ? "flex" : "none";
};

const addToBasket = (item, quantity) => {
  const itemInBasket = {
    ...item,
    quantity: parseInt(quantity, 10),
    totalPrice: (item.price || item.prices.small) * parseInt(quantity, 10)
  };
  basket.push(itemInBasket);
  console.log(basket);
  renderBasket();
};

const renderBasket = () => {
  const basketContainer = document.getElementById("basket");
  basketContainer.innerHTML = "";
  basket.forEach((item, index) => {
    const basketItem = document.createElement("div");
    basketItem.className = "basket-item";
    basketItem.innerHTML = `
                <h3>${item.name}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p>Total Price: ${item.totalPrice}</p>
            `;
    basketContainer.appendChild(basketItem);
  });
};

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
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
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
