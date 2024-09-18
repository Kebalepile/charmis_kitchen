import "./header.css";
import { logout } from "../../hooks/OrderService";
import { createSearchComponent } from "../search/SearchOrder";

/***
 * @description Creates a header component for the Orders Dashboard, which includes a logo, title, logout button, and a search toggle button.
 * 
 * @returns {HTMLElement} The header element containing the logo, title, logout button, and search button.
 * 
 */
export const createHeaderComponent = () => {
  // Create the header element
  const header = document.createElement("header");
  header.className = "header-nav";

  // Create logo
  const logo = document.createElement("img");
  logo.src = "/assets/boitekong_eats_logo.png";
  logo.alt = "Boitekong Eats Logo";
  logo.className = "logo";

  // Create the title
  const title = document.createElement("h1");
  title.textContent = "Orders Dashboard";

  // Create the header content container
  const headerContent = document.createElement("div");
  headerContent.className = "header-content";
  headerContent.appendChild(logo);
  headerContent.appendChild(title);

  // Create logout button
  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logout";
  logoutButton.className = "logout-button";
  logoutButton.onclick = async () => {
    logoutButton.disabled = true;
    try {
      const data = await logout();
      setTimeout(() => {
        logoutButton.disabled = false;
        location.reload();
      }, 2000);
    } catch (error) {
      console.error("Logout failed:", error);
      logoutButton.disabled = false;
    }
  };

  // Append the logout button to the header content container
  headerContent.appendChild(logoutButton);

  // Create the Search button (toggle for search component)
  const searchButton = document.createElement("button");
  searchButton.textContent = "Search Orders";
  searchButton.className = "search-button";

  // Track search component state (visible or hidden)
  let searchComponentVisible = false;

  // Toggle search component visibility
  searchButton.onclick = () => {
    searchComponentVisible = !searchComponentVisible;
    if (searchComponentVisible) {
      createSearchComponent(); // Show search component
    } else {
      const searchContainer = document.getElementById("search-container");
      if (searchContainer) searchContainer.remove(); // Hide search component
    }
  };

  // Append the search button to the header content container
  headerContent.appendChild(searchButton);

  // Append the header content container to the header element
  header.appendChild(headerContent);

  return header;
};
