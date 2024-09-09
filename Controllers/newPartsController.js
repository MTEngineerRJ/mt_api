const db = require("../Config/dbConfig");
const getLeadBYSNO = require("../Config/getLeadWithSNO");


const getSpecificNewParts = (req,res)=>{
  console.log("inside the new parts controller getSpecificNewParts!");
    const leadId = req.params.leadId;
    db.query("SELECT * FROM NewPartsReport WHERE LeadID=?",[leadId], (err, result2) => {
      if (err) {
        console.log(err);
        console.error(err);
        res.status(500).send("Internal Server Error ");
        return;
      }
      res.status(200).send(result2);
    });
  };

 const updateNewParts1 = async (req, res) => {
 
    try {
      const leadId = req.params.leadId;
  
      
      const data = JSON.parse(req.body.allRows);
 
      console.log(data);
  
      const promises = data.map((row,index) => {
        return new Promise((resolve, reject) => {
          const insertQuery = `
            INSERT INTO NewPartsReport (
              DepreciationPct,
              SNO,
              ItemName,
              HSNCode,
              Remark,
              Estimate,
              Assessed,
              QE,
              QA,
              BillSr,
              GSTPct,
              TypeOfMaterial,
              WithTax,
              IsActive,
              IsImt,
              LeadID
            ) VALUES (
              '${row.dep}',
               ${row.sno},
              '${row.description}',
              '${row.sac}',
              '${row.remark}',
              '${row.estimate}',
              '${row.assessed}',
              '${row.qe}',
              '${row.qa}',
              '${row.bill_sr}',
              '${row.gst}',
              '${row.type}',
              '${row.total}',
              '${row.isActive}',
              ${row.imt},
              '${parseInt(leadId)}'
            );
          `;
  
          const updateQuery = `
            UPDATE NewPartsReport
            SET
              DepreciationPct = '${row.dep}',
              ItemName = '${row.description}',
              HSNCode='${row.sac}',
              Remark='${row.remark}',
              Estimate = '${row.estimate}',
              Assessed = '${row.assessed}',
              QA='${row.qa}',
              QE = '${row.qe}',
              BillSr = '${row.bill_sr}',
              GSTPct='${row.gst}',
              TypeOfMaterial='${row.type}',
              WithTax='${row.total}',
              IsActive='${row.isActive}',
              IsImt=${row.imt}
            WHERE SNO = '${row.sno}' AND
            LeadID = '${leadId}';
          `;
  
  
         
          db.query("SELECT * FROM NewPartsReport WHERE SNO=? AND LeadID =?", [row.sno,leadId], (err, result2) => {
            if (err) {
              console.log(err);
              console.error(err);
              reject(err);
              return;
            }
            
            const check = getLeadBYSNO(result2,row.sno);
            
            if (result2.length > 0 ) {
              // console.log("update query",updateQuery)
              db.query(updateQuery, (err) => {
               
                if (err) {
                  console.log(err);
                  console.error(err);
                  reject(err);
                  return;
                }
                resolve();
              });
            } else {
              // console.log("insert query",insertQuery);
              db.query(insertQuery, (err) => {
                if (err) {
                  console.log(err);
                  console.error(err);
                  reject(err);
                  return;
                }
                resolve();
              });
            }
          });
        
        });
      });
  
      await Promise.all(promises);
  
      res.status(200).send("Successfully updated!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
    
  };
  

  module.exports={getSpecificNewParts,updateNewParts1}
  