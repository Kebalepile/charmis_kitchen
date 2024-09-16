/**
   * @description Generate a 4-digit random number using crypto API
   */
export const generateOrderNumber = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % 10000; // Ensure it's a 4-digit number
};

export const checkTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Convert current time to minutes since midnight
  const currentTime = hours * 60 + minutes;

  // Define time range in minutes since midnight
  const startTime = 9 * 60;  // 9:00 AM
  const endTime = 20 * 60; // 8:00 PM
  return { startTime, endTime, currentTime };
};

/**
 * @description use share Web Api to enable enduser to share certain data 
 * relating to the site.
 * @param {object} data 
 */
export  async function Share(data) {
  try {
    await navigator.share(data);
  } catch (err) {
    console.error(err);
  }
}
