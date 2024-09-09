 
const db = require("../Config/dbConfig");

 const getStatus = (req, res) => {
    const leadId = req.query.LeadId;
    const sql = "SELECT * FROM ClaimStatus";
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(result);
    });
  };

  const updateStatus = (req, res) => {
    const { LeadId, Status, subStage } = req.body;
    const NewStatus = Number(Status) < 1 ? 1 : Number(Status);

    const sql = "SELECT * FROM DocumentList WHERE LeadId =?";
    db.query(sql, [LeadId], (err, result) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        return;
      }
      const statusDetails = `
      UPDATE ClaimStatus
      SET
      Status = '${NewStatus}',
      SubStatus = '${1}'
      WHERE LeadId = ${LeadId};
    `;
  
      db.query(statusDetails, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.send(result);
      });
    });
  };
  

  module.exports={getStatus,updateStatus}