import { signup } from "../../hooks/Authentication";
import { renderLoadingSpinner } from "../loading/LoadingSpinner";
import "./accounts.css";

export function CreateVendorAccount() {
  const form = document.createElement("form");
  form.className = "vendor-form component";

  const usernameLabel = document.createElement("label");
  usernameLabel.textContent = "Enter Username:";
  usernameLabel.className = "form-label";
  form.appendChild(usernameLabel);

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.name = "username";
  usernameInput.className = "form-input";
  form.appendChild(usernameInput);

  const createButton = document.createElement("button");
  createButton.type = "button";
  createButton.textContent = "Create Acc";
  createButton.className = "form-button";
  form.appendChild(createButton);

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.className = "form-button";
  form.appendChild(cancelButton);

  const messageDiv = document.createElement("div");
  messageDiv.className = "message";
  form.appendChild(messageDiv);

  createButton.onclick = async () => {
    const username = usernameInput.value.trim();
    if (username) {
      const { toggleLoadingSpinner } = renderLoadingSpinner();
      toggleLoadingSpinner(true);
      try {
        const response = await signup(username);
        if (response.error) {
          alert(response.error.message);
          return;
        }
        messageDiv.innerHTML = `
      <hr/>
      <h4>New vendor account created</h4>
      <br/>
      <p><strong>Login details:</strong></p>
      <p><strong>Username: </strong><span id="username">${response.username}</span> <button id="copy-username" class="copy-button">Copy</button></p>
      <p><strong>PIN:</strong> <span id="pin">${response.pin}</span> <button id="copy-pin" class="copy-button">Copy</button></p>
  `;

        document.getElementById("copy-username").onclick = event => {
          event.preventDefault();
          navigator.clipboard.writeText(response.username);
        };
        document.getElementById("copy-pin").onclick = event => {
          event.preventDefault();
          navigator.clipboard.writeText(response.pin);
        };
      } catch (error) {
        alert(error);
      } finally {
        setTimeout(() => {
          toggleLoadingSpinner(false);
        }, 2000);
      }
    }
  };

  cancelButton.onclick = () => {
    form.remove();
  };

  document.body.appendChild(form);
}
