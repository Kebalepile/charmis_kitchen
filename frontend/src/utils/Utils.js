 /**
   * @description Generate a 4-digit random number using crypto API
   */
 export const generateOrderNumber = () => {
    
    const array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    return array[0] % 10000 // Ensure it's a 4-digit number
  }