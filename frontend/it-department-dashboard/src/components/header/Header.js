import "./header.css";
import { logout } from "../../hooks/OrderService";

/***
 * @description Creates a header component for the Orders Dashboard, which includes a logo, title, and logout button.
 * 
 * The header is designed to display the logo of Boitekong Eats, a title "Orders Dashboard," and a logout button that 
 * triggers the logout process and reloads the page after a short delay.
 * 
 * @returns {HTMLElement} The header element containing the logo, title, and logout button.
 * 
 * @example
 * // To render the header component in a specific container:
 * const header = createHeaderComponent();
 * document.body.appendChild(header);
 */
export const createHeaderComponent = () => {
  const header = document.createElement("header");
  header.className = "header-nav";

  /***
     * @description Creates and configures the logo image element.
     * 
     * @returns {HTMLImageElement} The logo image element for the header.
     */
  const logo = document.createElement("img");
  logo.src = "/boitekong_eats_logo.png";
  logo.alt = "Boitekong Eats Logo";
  logo.className = "logo";

  /***
     * @description Creates the main title element.
     * 
     * @returns {HTMLHeadingElement} The title element for the header.
     */
  const title = document.createElement("h1");
  title.textContent = "Orders Dashboard";

  /***
     * @description Creates a container element for holding the logo and title.
     * 
     * @returns {HTMLDivElement} The container element that wraps the logo and title.
     */
  const headerContent = document.createElement("div");
  headerContent.className = "header-content";
  headerContent.appendChild(logo);
  headerContent.appendChild(title);

  /***
     * @description Creates and configures the logout button.
     * The button triggers the logout process and reloads the page after a short delay.
     * 
     * @returns {HTMLButtonElement} The logout button element.
     */
  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logout";
  logoutButton.className = "logout-button";

  logoutButton.onclick = async () => {
    const data = await logout();

    // Reload the page after 2 seconds (2000 milliseconds)
    setTimeout(() => {
      location.reload();
    }, 2000);
  };

  // Append the logout button to the header content container
  headerContent.appendChild(logoutButton);

  // Append the header content container to the header element
  header.appendChild(headerContent);

  return header;
};
