const mysql = require("mysql2/promise");

// ✅ Create a connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "root", 
  password: "Vino@2003", 
  database: "employeeleavemanagement", 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test Database Connection
async function testDB() {
    try {
        const connection = await db.getConnection();
        console.log("✅ MySQL Connection Successful!");
        connection.release();
    } catch (err) {
        console.error("❌ MySQL Connection Failed:", err.message);
    }
}
testDB();
module.exports = db;
