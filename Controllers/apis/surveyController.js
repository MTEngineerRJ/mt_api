
const db = require("../../Config/dbConfig");


const surveyDetails = (req, res) => {
  const survey_id = req.query.survey_id

  console.log(survey_id);
  const { token } = req.headers

  if (!token) {
    return res
      .status(400)
      .json({ status: false, data: null, message: "invalid access token" });
  }

  if (!survey_id) {
    return res
      .status(400)
      .json({ status: false, data: null, message: "survey id can't be blank" });
  }

  const sql = 'SELECT '
    + 'claimdetails.LeadID, claimdetails.ReferenceNo, claimdetails.SurveyType, claimdetails.PolicyNumber, claimdetails.PolicyPeriodStart, claimdetails.PolicyPeriodEnd, claimdetails.ClaimNumber, claimdetails.IDV,'
    + 'insureddetails.InsuredAddress, insureddetails.InsuredName, insureddetails.InsuredMailAddress, insureddetails.InsuredMobileNo1,'
    + 'driverdetails.DriverName, driverdetails.LicenseNumber, driverdetails.DateOfIssue, driverdetails.IssuingAuthority, driverdetails.LicenseType, driverdetails.ValidUpto,'
    + 'vehicledetails.RegisteredNumber, vehicledetails.ChassisNumber, vehicledetails.EngineNumber, vehicledetails.MakerDesc, vehicledetails.MakerModel, vehicledetails.TypeOfBody, vehicledetails.VehicleClassDescription, ifnull(vehicledetails.PucNumber,"") as PucNumber, ifnull(vehicledetails.PucValidUntil,"") as PucValidUntil, vehicledetails.SeatingCapacity, vehicledetails.DateOfRegistration,'
    + 'ifnull(accidentdetails.CauseOfAccident,"") as CauseOfAccident, ifnull(accidentdetails.DateOfAccident,"") as DateOfAccident, ifnull(accidentdetails.TimeOfAccident,"") as TimeOfAccident, ifnull(accidentdetails.PlaceOfSurvey,"") as PlaceOfSurvey '
    + 'FROM claimdetails LEFT JOIN insureddetails ON claimdetails.LeadID = insureddetails.LeadID LEFT JOIN driverdetails ON claimdetails.LeadID = driverdetails.LeadID 		LEFT JOIN vehicledetails ON claimdetails.LeadID = vehicledetails.LeadID 		LEFT  JOIN claimstatus ON claimdetails.LeadID =  claimstatus.LeadID 		LEFT  JOIN accidentdetails ON claimdetails.LeadID =  accidentdetails.LeadID '
    + 'WHERE claimdetails.LeadID = 325 AND claimdetails.IsActive = true AND claimdetails.IsClaimCompleted = false';
  db.query(sql, [survey_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, data: null, message: "Internal Server Error" });
    }

    if (result.length === 1) {
      // Authentication successful
      return res.status(200).json({ status: true, data: result[0], message: "survey details found" });
    } else {
      // Authentication failed
      return res.status(401).json({ status: false, data: null, message: "No leads found" });
    }
  });
};

module.exports = { surveyDetails };