const express = require('express');
const router = express.Router();
const db = require('../db');

// Add Leave Type
// Example POST route to add leaveType
router.post("/leavetype", async (req, res) => {
  const { leaveType, description,} = req.body;

  if (!leaveType || !description ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await db.query(
      "INSERT INTO leavetypes (leaveType, description) VALUES (?, ?)",
      [leaveType, description]
    );

    res.status(201).json({ message: "Leave type added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//FETCH
router.get("/leavetypes",async(req,res)=>{
  try{
const[rows]=await db.query("SELECT * FROM leavetypes")
res.status(200).json(rows)
  }
  catch(err){
res.status(500).json({error:err.message});
  }
});
//DELETE
router.delete("/leavetype/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM leavetypes WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "leavetype not found" });
    }

    res.json({ message: "leavetype deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//UPDATE
router.put("/leavetype/:id", async (req, res) => {
  const { id } = req.params;
  const {  leaveType,description,createdDate } = req.body;

  if (!leaveType || !description || !createdDate) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE leavetypes SET leaveType = ?, description = ?, createdDate = ? WHERE id = ?",
      [leaveType,description,createdDate, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "leavetype not found" });
    }

    res.json({ message: "leavetype updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
