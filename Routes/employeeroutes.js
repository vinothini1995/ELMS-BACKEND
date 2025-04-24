const express=require('express');
const router=express.Router();
const db=require('../db');
const bcrypt = require("bcryptjs");

//add employee
router.post("/employee",async(req,res)=>{
const{emp_code, name,gender,department,email,contact,birthDate,password,city,country,address}=req.body;
if(!emp_code ||! name||!gender||!department||!email||!contact||!birthDate||!password||!city||!country||!address){
    return res.status(400).json({error:"all fields are required"})
}
const registeredDate = new Date(); // <-- this line adds the current timestamp
    const hashedPassword = await bcrypt.hash(password, 10);

try {
    const values = [emp_code, name, gender, department, email, contact, birthDate, hashedPassword, city, country, address, registeredDate,
    ];

    const [result] = await db.query(
      "INSERT INTO employee(emp_code, name, gender, department, email, contact, birthDate, password, city, country, address,registeredDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      values
    );
res.status(201).json({
    message: "employee added successfully",
    id: result.insertId,
    emp_code, name,gender,department,email,contact,birthDate,city, country,address,registeredDate
});
}
catch(err){
res.status(500).json({error:err.message})
}
});

router.get("/employee/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM employee WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/employees", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM employee");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  //DELETE
router.delete("/employee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM employee WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "employee not found" });
    }

    res.json({ message: "employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/employee/:id", async (req, res) => {
  const { id } = req.params;
  const { emp_code, name, gender, department, email, contact, birthDate, password, city, country, address } = req.body;

  // Make password optional for updates
  if (!emp_code || !name || !gender || !department || !email || !contact || !birthDate || !city || !country || !address) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  try {
    const updateData = {
      emp_code,
      name,
      gender,
      department,
      email,
      contact,
      birthDate,
      city,
      country,
      address
    };

    // Only update password if provided
    if (password) {
      updateData.password = password;
    }

    const [result] = await db.query(
      "UPDATE employee SET ? WHERE id = ?",
      [updateData, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ 
      error: "Update failed",
      details: err.message
    });
  }
});

module.exports=router;