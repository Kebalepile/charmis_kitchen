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
  const startTime = 6 * 60 + 30; // 6:30 AM
  const endTime = 18 * 60 + 30; // 6:30 PM
  return { startTime, endTime, currentTime };
};
