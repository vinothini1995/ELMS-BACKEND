const express = require("express");
const db = require("../db");
const bcrypt = require("bcryptjs"); // ✅ Needed for hashing
const router = express.Router();

router.post("/changepassword", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const [user] = await db.query("SELECT password FROM employee WHERE email = ?", [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await db.query(
      "UPDATE employee SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
