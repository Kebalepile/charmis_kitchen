const CustomerModel = require("../models/customer");
const TokenBlacklist = require("../models/tokenBlacklist");
const { hashPassword, comparePassword } = require("../utils/bcryptUtils");
const jwt = require("jsonwebtoken");

const RegisterCustomer = async (req, res) => {
  try {
    const { name, phone, address, password, answers } = req.body;
    // check if phone number already exists
    const existingUser = await CustomerModel.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: "Phone Number already exists 😕" });
    }
    // Hash the Password and security answers before saving
    const hashedPassword = await hashPassword(password);
    const securityAnswerOne = await hashPassword(answers[0]);
    const securityAnswerTwo = await hashPassword(answers[1]);

    // Create a new customer
    const newCustomer = new CustomerModel({
      name,
      phone,
      address,
      password: hashedPassword,
      securityAnswerOne,
      securityAnswerTwo
    });

    // Save the new user
    await newCustomer.save();
    // Generate a JWT token
    const token = jwt.sign({ phone }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });
    // Send response
    res.status(201).json({
      message: "🎉 Signed up successfully 🎉",
      phone,
      password,
      token
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to Register Customer 🥺" });
  }
};

const LoginCustomer = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Find user by phone
    const customer = await CustomerModel.findOne({ phone });
    if (!customer) {
      return res.status(400).json({ error: "Invalid Phone or Password 🥺" });
    }

    const isPasswordValid = await comparePassword(password, customer.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid Phone or Password 🥺" });
    }

    // Generate a JWT token
    const token = jwt.sign({ phone }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    // Send response
    res.status(200).json({
      message: "🎉 Login successful 🎉",
      token,
      profile: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Failed to login customer" });
  }
};

const LogoutCustomer = async (req, res) => {
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

const RestCustomerPassword = async (req, res) => {
  const { phone, answers, newPassword } = req.body;

  try {
    // Find the customer by phone
    const customer = await CustomerModel.findOne({ phone });
    if (!customer) {
      return res.status(400).json({ error: "Customer not found 🥺" });
    }

    // Check if answers array contains exactly two answers
    if (answers.length !== 2) {
      return res
        .status(400)
        .json({ error: "Security answers are required 😕" });
    }

    // Compare the hashed security answers
    const isAnswerOneValid = await comparePassword(
      answers[0],
      customer.securityAnswerOne
    );
    const isAnswerTwoValid = await comparePassword(
      answers[1],
      customer.securityAnswerTwo
    );

    if (!isAnswerOneValid || !isAnswerTwoValid) {
      return res.status(400).json({ error: "Incorrect security answers 😕" });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update customer's password
    customer.password = hashedPassword;
    await customer.save();

    // Send success response
    res.status(200).json({ message: "🎉 Password reset successfully 🎉" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to reset password 🥺" });
  }
};

const EditCustomerDetails = async (req, res) => {
  const { phone, name, address, newPassword, newAnswers, answers } = req.body;

  try {
    // Find the customer by phone
    const customer = await CustomerModel.findOne({ phone });
    if (!customer) {
      return res.status(400).json({ error: "Customer not found 🥺" });
    }
    // Check if answers array contains exactly two answers
    if (answers.length !== 2) {
      return res
        .status(400)
        .json({ error: "Security answers are required 😕" });
    }

    // Compare the hashed security answers
    const isAnswerOneValid = await comparePassword(
      answers[0],
      customer.securityAnswerOne
    );
    const isAnswerTwoValid = await comparePassword(
      answers[1],
      customer.securityAnswerTwo
    );

    if (!isAnswerOneValid || !isAnswerTwoValid) {
      return res.status(400).json({ error: "Incorrect security answers 😕" });
    }
    // Update basic details
    if (name) customer.name = name;
    if (address) customer.address = address;

    // Hash and update the password if provided
    if (newPassword) {
      const hashedPassword = await hashPassword(newPassword);
      customer.password = hashedPassword;
    }

    // Hash and update the security answers if provided
    if (newAnswers && newAnswers.length === 2) {
      customer.securityAnswerOne = await hashPassword(newAnswers[0]);
      customer.securityAnswerTwo = await hashPassword(newAnswers[1]);
    }

    // Save the updated customer
    await customer.save();

    // Send success response
    res
      .status(200)
      .json({ message: "🎉 Customer details updated successfully 🎉" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to edit customer details 🥺" });
  }
};

const updateOrderHistory = async (req, res) => {
    const { phone, orderNumber } = req.body;
    
    try {
        // Find the customer by phone
        const customer = await CustomerModel.findOne({ phone });
        
        if (!customer) {
            return res.status(400).json({ error: "Customer not found 🥺" });
        }
        
        // Push the new order number into the orderHistory array
        customer.orderHistory.push(orderNumber);
        
        // Save the updated customer document
        await customer.save();
        
        // Send success response
        res.status(200).json({ message: "🎉 Customer order history updated successfully 🎉" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to update customer order history 🥺" });
    }
};


module.exports = {
  RegisterCustomer,
  LoginCustomer,
  LogoutCustomer,
  RestCustomerPassword,
  EditCustomerDetails,
  upDateOrderHistory
};
