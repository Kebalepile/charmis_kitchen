import "./header.css"
import {logout} from "../../hooks/OrderService"
export const createHeaderComponent = () => {
    const header = document.createElement("header");
    header.className = "header-nav";
  
    // Create the logo image element
    const logo = document.createElement("img");
    logo.src = "/boitekong_eats_logo.png";
    logo.alt = "Boitekong Eats Logo";
    logo.className = "logo";
  
    // Create the main title
    const title = document.createElement("h1");
    title.textContent = "Orders Dashboard";
  
    // Create a container for the logo and title
    const headerContent = document.createElement("div");
    headerContent.className = "header-content";
    headerContent.appendChild(logo);
    headerContent.appendChild(title);
  
    // Create the logout button
    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Logout";
    logoutButton.className = "logout-button";
    logoutButton.onclick = async () => {
        const data = await logout();
        console.log(data)
    }; 
  
    // Append elements to the header
    header.appendChild(headerContent);
    header.appendChild(logoutButton);
  
    return header;
  };
  