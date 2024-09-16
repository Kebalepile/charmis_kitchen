import "./loading.css";

/**
 * @description Renders a loading spinner and handles adding/removing it from the DOM.
 * @param {boolean} initialState - Initial visibility state of the loading spinner.
 * @returns {{loadingContainer: HTMLDivElement, toggleLoadingSpinner: function(boolean): void}} The created loading spinner container element and a toggle function.
 */
export const renderLoadingSpinner = (initialState = false) => {
  const loadingContainer = document.createElement("div");
  loadingContainer.className = "loading-container";

  const spinner = document.createElement("div");
  spinner.className = "spinner";
  loadingContainer.appendChild(spinner);

  /**
   * @description Toggles the visibility of the loading spinner by adding or removing it from the DOM.
   * @param {boolean} show - Whether to show or hide the spinner.
   */
  const toggleLoadingSpinner = (show) => {
    sessionStorage.setItem("isLoading", show.toString());
    if (show) {
      if (!document.body.contains(loadingContainer)) {
        document.body.appendChild(loadingContainer);
      }
    } else {
      if (document.body.contains(loadingContainer)) {
        document.body.removeChild(loadingContainer);
      }
    }
  };

  // Set initial visibility based on the provided state or sessionStorage
  const isVisible = sessionStorage.getItem("isLoading") === "true" || initialState;
//   toggleLoadingSpinner(isVisible);

  return { toggleLoadingSpinner };
};
