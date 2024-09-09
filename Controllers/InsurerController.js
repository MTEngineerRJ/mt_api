 
const db = require("../Config/dbConfig");

 
const getInsurers = (req, res) => {
  
   const sql = "SELECT * FROM insurancecompanyname";
   db.query(sql, (err, result) => {
     if (err) {
       console.error(err);
       return res.status(500).send("Internal Server Error");
     }
     return res.status(200).json({ message: "Fetched successfully all Insurers",result });
     
   });
 };

 module.exports={getInsurers};