const CustomerModel = require("../models/customer");
const TokenBlacklist = require("../models/tokenBlacklist");
const { hashPassword, comparePassword } = require("../utils/bcryptUtils");
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
  try {
    const { name, phone, address, password } = req.body;
    // check if phone number already exsits
    const existingUser = await CustomerModel.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: "Phone Number already exists 😕" });
    }
    // Hash the Password before saving
    const hashedPassword = await hashPassword(password);
    // Create a new customer
    const newCustomer = new CustomerModel({
      name,
      phone,
      address,
      password: hashedPassword
    });

    // Save the new user
    await newCustomer.save();
    // Generate a JWT token
    const token = jwt.sign({ phone }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });
    // Send response
    res
      .status(201)
      .json({ message: "🎉signed up successfully 🎉", phone, password, token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to Register Customer 🥺" });
  }
};
const Login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Find user by phone
    const customer = await CustomerModel.findOne({ phone });

    if (!customer) {
      return res.status(400).json({ error: "Invalid Phone or Password 🥺" });
    }
    const isPassowrdValid = await comparePassword(password, customer.password);

    if (!isPassowrdValid) {
      return res.status(400).json({ error: "Invalid Phone or Password 🥺" });
    }

    // Generate a JWT token
    const token = jwt.sign({ phone }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    // Send response
    res.status(200).json({ message: "🎉 Login successful🎉", token });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Failed to login cutomer" });
  }
};

const Logout = async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];

  try {
    // Add the token to the blacklist
    const blacklistedToken = new TokenBlacklist({ token });
    await blacklistedToken.save();

    // Send response
    res.status(200).json({ message: "🎉 Logout successful 🎉" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to logout user" });
  }
};

const RestPassword = async (req, res) => {
    
};

modeule.exports = {
  Register,
  Login,
  Logout,
  RestPassword
};
