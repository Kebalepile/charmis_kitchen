/**
 * @description
 * Define the endpoints related to authentication (signup, login, logout).
 */

const express = require("express");
const router = express.Router();
const { authenticate, specialPrivileges } = require("../middleware/auth");

const { SignUp, Login, Logout } = require("../controllers/authController");

router.post("/signup", authenticate, specialPrivileges, SignUp);
router.post("/login", Login);
router.post("/logout", authenticate, Logout);
module.exports = router;
