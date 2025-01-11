import { SERVER_DOMAIN } from "./types.js";
// Use the browser's crypto API
const crypto = window.crypto || window.msCrypto; // for IE11
/**
 * Log in a user to obtain a JWT token.
 * 
 * @param {string} username - The username.
 * @param {string} pin - The PIN.
 * @returns {Promise<string>} A promise that resolves to the JWT token.
 */
export const login = async (username, pin) => {
  username = username.toLocaleLowerCase();
  try {
    const response = await fetch(`${SERVER_DOMAIN}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, pin })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to log in");
    }

    // Save the token in session storage if login is successful
    if (data.token) {
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("cookId", username);
    }
    // console.log(data)

    return data;
  } catch (error) {
    throw new Error("Failed to log in. Please try again.");
  }
};

/**
   * @description logout an end-user pcurrently logged in.
   */

export const logout = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${SERVER_DOMAIN}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to logout");
    }
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("cookId");

    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to logout");
  }
};

/**
   * @description create login details for new end-user
   * @param {string} username
   */
export const signup = async username => {
  username = username.toLowerCase();
  try {
    let response = await fetch(`${SERVER_DOMAIN}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Username already exists");
    }

    return data;
  } catch (err) {
    throw new Error(
      err.message || "Username already exists. Please try again."
    );
  }
};
/**
 * @description Check if the user has special privileges.
 * @returns {Promise<boolean>} True if the user has special privileges, false otherwise.
 */
export const hasSpecialPrivilege = async () => {
  const token = sessionStorage.getItem("token");
  const cookId = sessionStorage.getItem("cookId");

  if (!token || !cookId) {
    return false;
  }

  const hash = await generateSpecialHash(cookId);
  const specialHashes = [
    'e475d4c0a491053ef7a1507c630a871df5f9f4062475d53cde0cec96f4b7fc30' 
  ];

  return specialHashes.includes(hash);
};

/**
 * @description Generate a special hash for a given string.
 * @param {string} str - The input string.
 * @returns {Promise<string>} The generated hash.
 */
const generateSpecialHash = async (str) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};
