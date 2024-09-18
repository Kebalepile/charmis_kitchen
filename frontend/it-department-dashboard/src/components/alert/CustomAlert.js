import "./customerAlert.css"

/**
 * @description Create the custom alert dialog component
 * @param {string} message 
 * @return undefined
 */
export function createCustomAlert(message) {
    // Check if an alert is already there to avoid duplicates
    if (document.getElementById('customAlert')) {
      return;
    }
  
    // Create the backdrop div for blur
    const backdropDiv = document.createElement('div');
    backdropDiv.classList.add('alert-backdrop'); // Add a CSS class for styling
  
    // Create the alert container div
    const alertDiv = document.createElement('div');
    alertDiv.id = 'customAlert';
    alertDiv.classList.add('alert-container'); // Add a CSS class for styling
  
    // Create the message element
    const messagePara = document.createElement('p');
    messagePara.innerText = message;
    alertDiv.appendChild(messagePara);
  
    // Create the OK button
    const okButton = document.createElement('button');
    okButton.innerText = 'OK';
    okButton.classList.add('ok-button'); // Add a CSS class for button styling
  
    // Add event listener to remove the alert and backdrop when OK is clicked
    okButton.addEventListener('click', function () {
      document.body.removeChild(alertDiv); // Remove the alert from the DOM
      document.body.removeChild(backdropDiv); // Remove the backdrop from the DOM
      location.reload() // reload current window or webpage
    });
  
    alertDiv.appendChild(okButton);
  
    // Append the backdrop and alertDiv to the body
    document.body.appendChild(backdropDiv);
    document.body.appendChild(alertDiv);
  }
  