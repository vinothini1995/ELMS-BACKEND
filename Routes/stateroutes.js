const express=require('express');
const db=require('../db');
const router=express.Router();

// Node.js + Express example
router.get("/stats", async (req, res) => {
    try {
      const [empCount] = await db.query("SELECT  COUNT(*) AS count FROM employee");
      const [deptCount] = await db.query("SELECT COUNT(*) AS count FROM department");
      const [leaveTypeCount] = await db.query("SELECT COUNT(*) AS count FROM leavetypes");
  
      res.json({
        totalEmployees: empCount[0].count,
        totalDepartments: deptCount[0].count,
        totalLeaveTypes: leaveTypeCount[0].count
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });
module.exports=router;