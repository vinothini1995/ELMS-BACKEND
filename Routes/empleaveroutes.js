const express=require('express');
const router=express.Router();
const db=require('../db')

router.post("/empleave",async(req,res)=>{
    const{ fromDate, toDate,leaveType,description,name,emp_code,adminRemark}=req.body;
    if(!fromDate || !toDate ||!leaveType||!description ||!name ||!emp_code ){
        return res.status(400).json({error:"all fields are required"})
}
const status = "Pending"; // hardcoded here

const postingDate =new Date();
try{
    const values = [fromDate, toDate,leaveType,description,postingDate,name,emp_code,status,adminRemark];
    const [result] = await db.query(
        "INSERT INTO empapplyleave(fromDate, toDate,leaveType,description,postingDate,name,emp_code,status,adminRemark) VALUES (?,?,?,?,?,?,?,?,?)",
        values
      );
      res.status(201).json({
        message: "employee leave applied successfully",
        id: result.insertId,
        fromDate, toDate,leaveType,description,postingDate,name,emp_code,status,adminRemark
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

  
  router.get("/leave/:id", async (req, res) => {
    const {id } = req.params;
  
    try {
      const [rows] = await db.query(
        "SELECT * FROM empapplyleave WHERE emp_code = ?",
      [id]
      );
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
module.exports=router;