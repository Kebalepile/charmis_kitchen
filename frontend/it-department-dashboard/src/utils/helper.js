/**
 * @description reloads the current location page
 * @param {Number} seconds 
 */
export const refresh = (
  seconds = 2000,
  task = () => {
    console.log("refesh page");
  }
) => {
  setTimeout(() => {
    task();
    location.reload();
  }, seconds);
};
