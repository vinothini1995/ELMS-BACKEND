const express = require("express");
const db = require("../db");
const bcrypt = require("bcryptjs"); // ✅ Needed for hashing
const router = express.Router();

router.post("/changepassword", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    // First, check in employee table
    let [user] = await db.query("SELECT password FROM employee WHERE email = ?", [email]);
    let table = "employee";

    // If not found in employee, check users table
    if (user.length === 0) {
      [user] = await db.query("SELECT password FROM users WHERE email = ?", [email]);
      table = "users";
    }

    // Still not found
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update in both tables (even if user is in only one)
    await db.query("UPDATE employee SET password = ? WHERE email = ?", [hashedPassword, email]);
    await db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
