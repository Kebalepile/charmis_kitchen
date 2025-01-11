 export const createButton = (text) => {
    const button = document.createElement("button");
    button.className = "special-button";
    button.textContent = text;
    return button;
  };