import "../../styles/login.css"
import { login } from "../hooks/OrderService";

export const renderLoginForm = () => {
  const form = document.createElement("form");
  form.className = "login-form";

  const usernameLabel = document.createElement("label");
  usernameLabel.textContent = "Username:";
  form.appendChild(usernameLabel);

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.name = "username";
  usernameInput.required = true;
  form.appendChild(usernameInput);

  const pinLabel = document.createElement("label");
  pinLabel.textContent = "PIN:";
  form.appendChild(pinLabel);

  const pinInput = document.createElement("input");
  pinInput.type = "password";
  pinInput.name = "pin";
  pinInput.required = true;
  form.appendChild(pinInput);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Login";
  form.appendChild(submitButton);

  const message = document.createElement("p");
  message.className = "login-message";
  form.appendChild(message);

  form.onsubmit = async (event) => {
    event.preventDefault();

    const username = usernameInput.value;
    const pin = pinInput.value;

    try {
      const data = await login(username, pin);
      if (data.message) {
        message.textContent = data.message;
        message.classList.add("success");
        message.classList.remove("error");
      }
    } catch (error) {
      console.error("Failed to log in:", error);
      message.textContent = error.message || "Failed to log in. Please try again.";
      message.classList.add("error");
      message.classList.remove("success");
    }
  };

  return form;
};
