const express=require('express');
const router=express.Router();
const db=require("../db");

router.get("/leave/details/:id", async (req, res) => {
    const {id}  = req.params;
  
    try {
      const [rows] = await db.query(
        `SELECT e.emp_code, e.name, e.gender, e.email, e.contact, 
                l.leaveType, l.description, l.fromDate, l.toDate, l.postingDate,l.status,l.adminRemark
         FROM employee e
         JOIN empapplyleave l ON e.emp_code = l.emp_code
         WHERE l.id = ?
        ` , 
    [id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "No leave details found for this employee" });
      }
  
      res.status(200).json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.put("/leave/update/:id", async (req, res) => {
    const { id } = req.params;
    const { status, adminRemark } = req.body;
  
    try {
      // You can choose to update the most recent leave application
      const [result] = await db.query(
        `UPDATE empapplyleave 
         SET status = ?, adminRemark = ?
         WHERE id = ?
        `,
        [status, adminRemark, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "No leave record found to update" });
      }
  
      res.status(200).json({ message: "Leave updated successfully" });
    } catch (err) {
      console.error("Error updating leave:", err);
      res.status(500).json({ error: err.message });
    }
  });
  
module.exports=router;  