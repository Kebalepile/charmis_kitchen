import "./login.css";
import { login, signup } from "../../hooks/OrderService";

export const renderLoginForm = () => {
  const form = document.createElement("form");
  form.className = "login-form";

  // Create username label and input
  const usernameLabel = document.createElement("label");
  usernameLabel.textContent = "Username:";
  
  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.name = "username";
  usernameInput.required = true;
  
  // Append input as a child of the label
  usernameLabel.appendChild(usernameInput);
  form.appendChild(usernameLabel);

  // Create PIN label and input
  const pinLabel = document.createElement("label");
  pinLabel.textContent = "PIN:";
  
  const pinInput = document.createElement("input");
  pinInput.type = "password";
  pinInput.name = "pin";
  pinInput.required = true; // Initially required for login
  
  // Append input as a child of the label
  pinLabel.appendChild(pinInput);
  form.appendChild(pinLabel);

  // Submit button
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.id = "login-btn";
  submitButton.textContent = "Login";
  form.appendChild(submitButton);

  // Mode toggle button
  const modeToggle = document.createElement("button");
  modeToggle.type = "button";
  modeToggle.className = "mode-toggle";
  modeToggle.textContent = "Signup";
  form.appendChild(modeToggle);

  // Message paragraph
  const message = document.createElement("p");
  message.className = "login-message";
  form.appendChild(message);

  // Container for new login details
  const newDetailsContainer = document.createElement("div");
  newDetailsContainer.className = "new-login-details";
  newDetailsContainer.style.display = "none"; // Hidden by default

  const detailsHeader = document.createElement("p");
  detailsHeader.textContent = "Here are your new login details:";
  newDetailsContainer.appendChild(detailsHeader);

  // Username display and copy button
  const usernameDetail = document.createElement("div");
  usernameDetail.className = "detail-group";

  const newUsernameLabel = document.createElement("span");
  newUsernameLabel.className = "new-detail-label";
  newUsernameLabel.textContent = "Username: ";
  usernameDetail.appendChild(newUsernameLabel);

  const newUsernameSpan = document.createElement("span");
  newUsernameSpan.className = "new-detail-value";
  usernameDetail.appendChild(newUsernameSpan);

  const copyUsernameButton = document.createElement("button");
  copyUsernameButton.type = "button";
  copyUsernameButton.textContent = "📋 Copy";
  usernameDetail.appendChild(copyUsernameButton);
  
  newDetailsContainer.appendChild(usernameDetail);

  // PIN display and copy button
  const pinDetail = document.createElement("div");
  pinDetail.className = "detail-group";

  const newPinLabel = document.createElement("span");
  newPinLabel.className = "new-detail-label";
  newPinLabel.textContent = "PIN: ";
  pinDetail.appendChild(newPinLabel);

  const newPinSpan = document.createElement("span");
  newPinSpan.className = "new-detail-value";
  pinDetail.appendChild(newPinSpan);

  const copyPinButton = document.createElement("button");
  copyPinButton.type = "button";
  copyPinButton.textContent = "📋 Copy";
  pinDetail.appendChild(copyPinButton);

  newDetailsContainer.appendChild(pinDetail);
  form.appendChild(newDetailsContainer);

  let isLoginMode = true; // Initial mode is "Login"

  modeToggle.onclick = () => {
    isLoginMode = !isLoginMode;
    submitButton.textContent = isLoginMode ? "Login" : "Signup";
    modeToggle.textContent = isLoginMode ? "Signup" : "Login";
    
    // Hide PIN field and remove required attribute for signup
    if (isLoginMode) {
     
      pinInput.setAttribute("required", "true");
      newDetailsContainer.style.display = "none"; // Hide new details on login
    } else {
      pinLabel.style.display = "none";
      pinInput.style.display = "none";
      pinInput.removeAttribute("required");
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.textContent = "Copied to clipboard!";
        message.classList.add("success");
        setTimeout(() => {
          message.textContent = ""; // Clear message after a short delay
        }, 2000);
      })
      .catch((err) => {
        console.error("Could not copy text:", err);
      });
  };

  // Attach copy functionality to buttons
  copyUsernameButton.onclick = () => copyToClipboard(newUsernameSpan.textContent);
  copyPinButton.onclick = () => copyToClipboard(newPinSpan.textContent);

  form.onsubmit = async (event) => {
    event.preventDefault();

    const username = usernameInput.value;
    const pin = pinInput.value;

    try {
      let data;
      if (isLoginMode) {
        data = await login(username, pin);
      } else {
        data = await signup(username);
      }

      if (data.message) {
        message.textContent = data.message;
        message.classList.add("success");
        message.classList.remove("error");
        // Reload the page after 2 seconds (2000 milliseconds)
          setTimeout(function() {
            location.reload();
        }, 2000);

        // Show new login details if in signup mode
        if (!isLoginMode && data.username && data.pin) {
          newUsernameSpan.textContent = data.username;
          newPinSpan.textContent = data.pin;
          newDetailsContainer.style.display = "block";
        }
      }
    } catch (error) {
      console.error(`Failed to ${isLoginMode ? "log in" : "sign up"}:`, error);
      message.textContent = error.message || `Failed to ${isLoginMode ? "log in" : "sign up"}. Please try again.`;
      message.classList.add("error");
      message.classList.remove("success");
    }
  };

  return form;
};
