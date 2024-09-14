
const db = require("../Config/dbConfig");

const sql = `SELECT DISTINCT
                CD.LeadID AS LeadID,
                CD.ReferenceNo AS ReferenceID,
                ID.InsuredName AS PolicyHolder,
                CD.PolicyNumber AS PolicyNo,
                CD.InspectionType AS InspectionType,
                CD.AddedDateTime AS AddedDate,
                CD.Region AS Region,
                VD.RegisteredNumber AS VehicleNo,
                ID.InsuredAddress AS City,
                GD.GarageNameAndAddress AS AssignedGarage,
                GD.GarageContactNo1 AS GarageContactNo,
                GD.GarageMailAddress AS RepairerMailId,
                CS.Status AS CurrentStatus,
                CS.SubStatus AS CurrentSubStatus,
                DATEDIFF(NOW(), CD.AddedDateTime) AS TAT,
                (SELECT COUNT(*) FROM DocumentList DL WHERE DL.LeadId = CD.LeadId) AS IsDocumentUploaded
            FROM
                ClaimDetails CD
                INNER JOIN InsuredDetails ID ON CD.LeadId = ID.LeadId
                INNER JOIN VehicleDetails VD ON CD.LeadId = VD.LeadId
                INNER JOIN GarageDetails GD ON CD.LeadId = GD.LeadId
                INNER JOIN ClaimStatus CS ON CD.LeadId = CS.LeadId
            WHERE 
                CD.Region = ?
            LIMIT ?, 20`;

const pendingLeads = (req, res) => {
  const Region = req.query.Region
  // const {  Region2, Region3, Region4, Region5, CalimStatus } =
  //   req.query;
  // const sql = "CALL GetPolicyInfoByRegions(?, ?, ?, ?, ?, ?)";
  // const params = [
  //   Region,
  //    null,
  //    null,
  //    null,
  //    null,
  //   CalimStatus || null,
  // ];

  db.query(sql, [Region], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(result);
  });


  // if (!Region) {
  //   return res
  //     .status(200)
  //     .json({ status: false, data: null, message: "invalid region" });
  // }
  // db.query(sql, [Region, 1, 3], (err, result) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).json({ status: false, data: null, message: "Internal Server Error" });
  //   }
  //   return res.status(200).json({ status: true, data: result, message: "pending Leads found" });
  //   l̥
  // });
};


const historyLeads = (req, res) => {
  const Region = req.query.Region
  if (!Region) {
    return res
      .status(200)
      .json({ status: false, data: null, message: "invalid region" });
  }
  db.query(sql, [Region, 4, 9], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, data: null, message: "Internal Server Error" });
    }
    return res.status(200).json({ status: true, data: result, message: "pending Leads found" });
    l̥
  });
};

const getAllSurvey = (req, res) => {
  const Region = req.query.Region
  const offset = parseInt(req.query.offset)
  if (!Region) {
    return res.json({ status: false, data: null, message: "invalid region" });
  }
  db.query(sql, [Region, offset], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ status: false, data: null, message: "Internal Server Error" });
    }
    return res.json({ status: true, data: result, message: "survey found" });
  });
};

module.exports = { pendingLeads, historyLeads, getAllSurvey };