const express=require('express');
const router=express.Router();
const db=require('../db')

router.post("/empleave",async(req,res)=>{
    const{ fromDate, toDate,leaveType,description,name,emp_code}=req.body;
    if(!fromDate || !toDate ||!leaveType||!description ||!name ||!emp_code){
        return res.status(400).json({error:"all fields are required"})
}
const postingDate =new Date();
try{
    const values = [fromDate, toDate,leaveType,description,postingDate,name,emp_code];
    const [result] = await db.query(
        "INSERT INTO empapplyleave(fromDate, toDate,leaveType,description,postingDate,name,emp_code) VALUES (?,?,?,?,?,?,?)",
        values
      );
      res.status(201).json({
        message: "employee leave applied successfully",
        id: result.insertId,
        fromDate, toDate,leaveType,description,postingDate,name,emp_code
        });
}

catch(err){
    res.status(500).json({error:err.message})

}
})

//FETCH
router.get("/leave",async(req,res)=>{
    try{
  const[rows]=await db.query("SELECT * FROM empapplyleave")
  res.status(200).json(rows)
    }
    catch(err){
  res.status(500).json({error:err.message});
    }
  });

  
  router.get("/leave/:emp_code", async (req, res) => {
    const { emp_code } = req.params;
  
    try {
      const [rows] = await db.query(
        "SELECT * FROM empapplyleave WHERE emp_code = ?",
        [emp_code]
      );
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
module.exports=router;