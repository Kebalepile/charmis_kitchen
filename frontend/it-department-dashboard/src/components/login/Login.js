import "./login.css";
import { login, signup } from "../../hooks/Authentication";
import { renderLoadingSpinner } from "../loading/LoadingSpinner";
import { refresh } from "../../utils/helper";
/***
 * @description Creates a label and input element with the specified attributes.
 * @param {string} labelText - The text for the label element.
 * @param {string} inputType - The type attribute for the input element (e.g., "text", "password").
 * @param {string} inputName - The name attribute for the input element.
 * @param {boolean} [isRequired=false] - Whether the input element is required. Default is false.
 * @returns {{label: HTMLLabelElement, input: HTMLInputElement}} An object containing the created label and input elements.
 */
const createLabelAndInput = (
  labelText,
  inputType,
  inputName,
  isRequired = false
) => {
  const label = document.createElement("label");
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = inputType;
  input.name = inputName;
  if (isRequired) input.required = true;

  label.appendChild(input);
  return { label, input };
};

/***
 * @description Creates a detail group containing a label, a value span, and a button for copying details.
 * @param {string} labelText - The text for the label element.
 * @param {string} buttonText - The text for the copy button.
 * @returns {{detailGroup: HTMLDivElement, valueSpan: HTMLSpanElement, copyButton: HTMLButtonElement}} An object containing the created detail group, value span, and copy button elements.
 */
const createDetailGroup = (labelText, buttonText) => {
  const detailGroup = document.createElement("div");
  detailGroup.className = "detail-group";

  const label = document.createElement("span");
  label.className = "new-detail-label";
  label.textContent = labelText;

  const valueSpan = document.createElement("span");
  valueSpan.className = "new-detail-value";

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.textContent = buttonText;

  detailGroup.appendChild(label);
  detailGroup.appendChild(valueSpan);
  detailGroup.appendChild(copyButton);

  return { detailGroup, valueSpan, copyButton };
};

/***
 * @description Renders the login/signup form and handles form submission, mode toggling, and copying details to clipboard.
 * @returns {HTMLFormElement} The created login/signup form element.
 */

export const renderLoginForm = () => {
  const form = document.createElement("form");
  form.className = "login-form";

  // Create and append username input field
  const { label: usernameLabel, input: usernameInput } = createLabelAndInput(
    "Name:",
    "text",
    "username",
    true
  );
  form.appendChild(usernameLabel);

  // Create and append pin input field
  const { label: pinLabel, input: pinInput } = createLabelAndInput(
    "Pin:",
    "password",
    "pin",
    true
  );
  form.appendChild(pinLabel);

  // Create and append the submit button
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.id = "login-btn";
  submitButton.textContent = "Login";
  form.appendChild(submitButton);

  // Create and append the mode toggle button
  const modeToggle = document.createElement("button");
  modeToggle.type = "button";
  modeToggle.className = "mode-toggle";
  modeToggle.textContent = "Signup";
  modeToggle.disabled = true; // Disable the signup button
  // form.appendChild(modeToggle);

  // Create and append the message paragraph
  const message = document.createElement("p");
  message.className = "login-message";
  form.appendChild(message);

  // Create and append the new details container
  const newDetailsContainer = document.createElement("div");
  newDetailsContainer.className = "new-login-details";
  newDetailsContainer.style.display = "none";

  const detailsHeader = document.createElement("p");
  detailsHeader.textContent = "Here are your new login details:";
  newDetailsContainer.appendChild(detailsHeader);

  const {
    detailGroup: usernameDetailGroup,
    valueSpan: newUsernameSpan,
    copyButton: copyUsernameButton
  } = createDetailGroup("NAME: ", "📋 Copy");
  newDetailsContainer.appendChild(usernameDetailGroup);

  const {
    detailGroup: pinDetailGroup,
    valueSpan: newPinSpan,
    copyButton: copyPinButton
  } = createDetailGroup("PIN: ", "📋 Copy");
  newDetailsContainer.appendChild(pinDetailGroup);

  form.appendChild(newDetailsContainer);

  const { toggleLoadingSpinner } = renderLoadingSpinner();

  let isLoginMode = true;

  modeToggle.onclick = () => {
    isLoginMode = !isLoginMode;
    submitButton.textContent = isLoginMode ? "Login" : "Signup";
    modeToggle.textContent = isLoginMode ? "Signup" : "Login";
    pinInput.required = isLoginMode;
    pinLabel.style.display = isLoginMode ? "block" : "none";
    pinInput.style.display = isLoginMode ? "block" : "none";
    newDetailsContainer.style.display = "none";
  };

  const copyToClipboard = text => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.textContent = "Copied to clipboard!";
        message.classList.add("success");
        refresh(2000, () => (message.textContent = ""));
      })
      .catch(err => console.error("Could not copy text:", err));
  };

  copyUsernameButton.onclick = () =>
    copyToClipboard(newUsernameSpan.textContent);
  copyPinButton.onclick = () => copyToClipboard(newPinSpan.textContent);

  form.onsubmit = async event => {
    toggleLoadingSpinner(true);
    event.preventDefault();

    const username = usernameInput.value;
    const pin = pinInput.value;
    let data;
    try {
      // comment in production
      // data = isLoginMode ? await login(username, pin) : await signup(username);
      // comment above code in production
      data = isLoginMode
        ? await login(username, pin)
        : (() => {
            alert("You're not authorized!");
            return "Not Allowed";
          })();
      if (data.message) {
        message.textContent = data.message;
        message.classList.add("success");
        message.classList.remove("error");

        refresh();

        if (!isLoginMode && data.username && data.pin) {
          newUsernameSpan.textContent = data.username;
          newPinSpan.textContent = data.pin;
          newDetailsContainer.style.display = "block";
        }
      }
    } catch (error) {
      message.textContent =
        error.message ||
        `Failed to ${isLoginMode ? "log in" : "sign up"}. Please try again.`;
      message.classList.add("error");
      message.classList.remove("success");
    } finally {
      toggleLoadingSpinner(false);
    }
  };

  return form;
};
