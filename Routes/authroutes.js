const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");  // Import DB connection
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const { name, email, password, mobile, address, role } = req.body;

    const [userExists] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password, mobile, address, role) VALUES ( ?, ?, ?, ?, ?, ?)";
    const values = [name, email, hashedPassword, mobile, address, role];

    await db.query(sql, values);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
});

router.post("/test", (req, res) => {
    console.log("Test route hit");
    res.status(200).json({ message: "Working" });
  });


  // router.post("/login", async (req, res) => {
  //   try {
  //     console.log("Login attempt received");
  //     const { email, password } = req.body;
  
  //     if (!email || !password) {
  //       return res.status(400).json({ message: "Email and Password are required" });
  //     }
  
  //     const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  //     if (rows.length === 0) {
  //       return res.status(401).json({ message: "User not found" });
  //     }
  
  //     const user = rows[0];
  //     const isMatch = await bcrypt.compare(password, user.password);
  
  //     if (!isMatch) {
  //       return res.status(401).json({ message: "Invalid credentials" });
  //     }
  
  //     const token = jwt.sign({ id: user.id, role: user.role }, "your_secret_key", { expiresIn: "1h" });
  
  //     return res.json({ message: "Login successful", token, role: user.role });
  //   } catch (err) {
  //     console.error("Login Error:", err);
  //     return res.status(500).json({ message: "Server error during login" });
  //   }
  // });
  
  router.post("/login", async (req, res) => {
    try {
      console.log("Login attempt received");
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
      }
  
      // First check in users table
      const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (users.length > 0) {
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  
        const token = jwt.sign({ id: user.id, role: user.role }, "your_secret_key", { expiresIn: "1h" });
  
        return res.json({ message: "Login successful", token, role: user.role, from: "users" });
      }
  
      // If not found in users, check in employee table
      const [employees] = await db.query("SELECT * FROM employee WHERE email = ?", [email]);
      if (employees.length > 0) {
        const emp = employees[0];
        const isMatch = await bcrypt.compare(password, emp.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  
        const token = jwt.sign({ id: emp.id, role: "employee" }, "your_secret_key", { expiresIn: "1h" });
  
        return res.json({ message: "Login successful", token, role: "employee", from: "employee" });
      }
  
      return res.status(401).json({ message: "User not found" });
    } catch (err) {
      console.error("Login Error:", err);
      return res.status(500).json({ message: "Server error during login" });
    }
  });
  
  
module.exports = router;
