
const db = require("../Config/dbConfig");


const getSpecificLabourer = (req,res)=>{
    const leadId = req.params.leadId;
    db.query("SELECT * FROM LabourReport", (err, result2) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.status(200).send(result2);
    });
  };

const updateLabrorer = async (req, res) => {
    try {
      const leadId = req.params.leadId;
      const data = JSON.parse(req.body.allRows);
   
      const gstPct = (req.body.gstPct);
      const promises = data.map((row) => {
        return new Promise((resolve, reject) => {
          const insertQuery = `
            INSERT INTO LabourReport (
              Description,
              SAC,
              SNO,
              Estimate,
              Assessed,
              BillSr,
              IsGSTIncluded,
              GSTPercentage,
              IsActive,
              JobType,
              LeadID
            ) VALUES (
              '${row.description}',
              '${row.sac}',
              '${row.sno}',
              '${row.estimate}',
              '${row.assessed}',
              '${row.bill_sr}',
              '${row.gst}',
              '${gstPct}',
              '${row.isActive}',
               ${row.type},
              '${parseInt(leadId)}'
            );
          `;
  
          const updateQuery = `
            UPDATE LabourReport
            SET
            Description = '${row.description}',
              SAC='${row.sac}',
              Estimate = '${row.estimate}',
              Assessed = '${row.assessed}',
              BillSr = '${row.bill_sr}',
              IsGSTIncluded='${row.gst}',
              GSTPercentage='${gstPct}',
              IsActive='${row.isActive}',
              JobType=${row.type}
            WHERE SNO = '${row.sno}' AND
            LeadID = '${leadId}';
          `;
         

          db.query("SELECT * FROM LabourReport WHERE SNO = ? AND LeadID=? ", [row.sno,leadId], (err, result2) => {
            if (err) {
              console.error(err);
              reject(err);
              return;
            }
  
            if (result2.length > 0) {
              
               
              db.query(updateQuery, (err) => {
                if (err) {
                  console.error(err);
                  reject(err);
                  return;
                }
                resolve();
              });
            } else {
              
              db.query(insertQuery, (err) => {
                if (err) {
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
  module.exports={getSpecificLabourer,updateLabrorer}