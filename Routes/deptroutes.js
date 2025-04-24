const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Make the route async
router.post("/department", async (req, res) => {
  const { code, name, shortName } = req.body;

  if (!code || !name || !shortName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // ✅ Use await with promise-style pool
    const [result] = await db.query(
      "INSERT INTO department (code, name, shortName) VALUES (?, ?, ?)",
      [code, name, shortName]
    );

    res.status(201).json({
      message: "Department added successfully",
      id: result.insertId,
      code,
      name,
      shortName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ✅ Get all departments
router.get("/departments", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM department");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE a department by ID
router.delete("/department/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM department WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT (Update) a department by ID
router.put("/department/:id", async (req, res) => {
  const { id } = req.params;
  const { code, name, shortName } = req.body;

  if (!code || !name || !shortName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE department SET code = ?, name = ?, shortName = ? WHERE id = ?",
      [code, name, shortName, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json({ message: "Department updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
