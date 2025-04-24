const express = require("express");
const cors = require("cors");
const db = require("./db"); // Import MySQL connection
const authRoutes=require("./Routes/authroutes");
const pwroutes=require("./Routes/pwroutes");
const deptroutes=require("./Routes/deptroutes");
const app = express();
const leaveroutes=require("./Routes/leaveroutes");
const employeeroutes=require("./Routes/employeeroutes");
const empleaveroutes=require("./Routes/empleaveroutes");
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Parses URL-encoded data

app.use(cors());

  
app.use("/api/auth", authRoutes);
app.use("/api/pw",pwroutes);
app.use("/api/dept",deptroutes);
app.use("/api/leave",leaveroutes);
app.use("/api/emp",employeeroutes);
app.use("/api/employeeleave",empleaveroutes)
const PORT = process.env.PORT || 5000;

// ✅ Start the Express server
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
