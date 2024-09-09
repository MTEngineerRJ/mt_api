
const db = require("../../Config/dbConfig");

const sql = "SELECT claimdetails.LeadID, claimdetails.ReferenceNo, claimdetails.SurveyType, claimdetails.PolicyNumber, insureddetails.InsuredAddress, insureddetails.InsuredName,vehicledetails.RegisteredNumber, claimdetails.PolicyType  FROM claimdetails JOIN insureddetails ON claimdetails.LeadID = insureddetails.LeadID JOIN vehicledetails ON claimdetails.LeadID =  vehicledetails.LeadID JOIN claimstatus ON claimdetails.LeadID =  claimstatus.LeadID WHERE AssignedToId = ? AND claimstatus.Status BETWEEN ? AND ? AND  claimdetails.IsActive = true AND claimdetails.IsClaimCompleted = false";

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