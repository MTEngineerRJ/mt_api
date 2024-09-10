
const db = require("../../Config/dbConfig");

const sql = "SELECT ClaimDetails.LeadID, ClaimDetails.ReferenceNo, ClaimDetails.SurveyType, ClaimDetails.PolicyNumber, InsuredDetails.InsuredAddress, InsuredDetails.InsuredName,VehicleDetails.RegisteredNumber, ClaimDetails.PolicyType  FROM ClaimDetails JOIN InsuredDetails ON ClaimDetails.LeadID = InsuredDetails.LeadID JOIN VehicleDetails ON ClaimDetails.LeadID =  VehicleDetails.LeadID JOIN ClaimStatus ON ClaimDetails.LeadID =  ClaimStatus.LeadID WHERE AssignedToId = ? AND ClaimStatus.Status BETWEEN ? AND ? AND  ClaimDetails.IsActive = true AND ClaimDetails.IsClaimCompleted = false";

const pendingLeads = (req, res) => {
  console.log(req.headers)
  const { token } = req.headers
  if (!token) {
    return res
      .status(400)
      .json({ status: false, data: null, message: "invalid access token" });
  }

  db.query(sql, [token, 1, 3], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, data: null, message: "Internal Server Error" });
    }
    return res.status(200).json({ status: true, data: result, message: "pending Leads found" });
    l̥
  });
};


const historyLeads = (req, res) => {
  console.log(req.headers)
  const { token } = req.headers
  if (!token) {
    return res
      .status(400)
      .json({ status: false, data: null, message: "invalid access token" });
  }

  db.query(sql, [token, 4, 9], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, data: null, message: "Internal Server Error" });
    }
    return res.status(200).json({ status: true, data: result, message: "pending Leads found" });
    l̥
  });
};

module.exports = { pendingLeads, historyLeads };