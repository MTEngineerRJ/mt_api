 
const db = require("../Config/dbConfig");

const getRegions = (req, res) => {
   const sql = "SELECT * FROM regions";
   db.query(sql, (err, result) => {
     if (err) {
       console.error(err);
       res.status(500).send("Internal Server Error");
       return;
     }
     res.send(result);
   });
 };


 module.exports={getRegions}