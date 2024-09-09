
const db = require("../../Config/dbConfig");


const updateSurveyDetails = (req, res) => {
  const { token } = req.headers

  const {
    LeadID,
    ReferenceNo,
    IDV,
    InsuredName,
    InsuredAddress,
    InsuredMobileNo,
    InsuredMailAddress,
    RegisteredNumber,
    ChassisNumber,
    EngineNumber,
    MakerDesc,
    MakerModel,
    TypeOfBody,
    VehicleClassDescription,
    DateOfRegistration,
    PucNumber,
    PucValidUntil,
    SeatingCapacity,
    DriverName,
    LicenseNumber,
    DateOfIssue,
    IssuingAuthority,
    LicenseType,
    ValidUpto,
    PolicyNumber,
    PolicyPeriodStart,
    PolicyPeriodEnd,
    ClaimNumber,
    CauseOfAccident,
    PlaceOfSurvey,
    DateOfAccident,
    TimeOfAccident,

    locationID,
    spot,
    final,
    preInspection,
    insurerName,
    estimateAmount,
    dateOfDeputation,
    accidentPlace,
    permitNumber,
    taxPaidUpto,
    badgeNumber,
    endorsementOfLicence,
    anyPoliceReport,
    thirdPartyLose,
    insurerAddress
  } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ status: false, data: null, message: "invalid access token" });
  }

  if (!LeadID) {
    return res
      .status(400)
      .json({ status: false, data: null, message: "survey id can't be blank" });
  }

  const updateClaimDetails = `UPDATE claimdetails 
  LEFT JOIN
  insureddetails ON claimdetails.LeadID = insureddetails.LeadID
      LEFT JOIN
  driverdetails ON claimdetails.LeadID = driverdetails.LeadID
      LEFT JOIN
  vehicledetails ON claimdetails.LeadID = vehicledetails.LeadID
      LEFT JOIN
  claimstatus ON claimdetails.LeadID = claimstatus.LeadID
      LEFT JOIN
  accidentdetails ON claimdetails.LeadID = accidentdetails.LeadID
  SET
  claimdetails.ReferenceNo='${ReferenceNo}',
  claimdetails.PolicyNumber='${PolicyNumber}',
  claimdetails.PolicyPeriodStart='${PolicyPeriodStart}',
  claimdetails.PolicyPeriodEnd='${PolicyPeriodEnd}',
  claimdetails.ClaimNumber='${ClaimNumber}',
  claimdetails.IDV='${IDV}',
  insureddetails.InsuredAddress='${InsuredAddress}',
  insureddetails.InsuredName='${InsuredName}',
  insureddetails.InsuredMailAddress='${InsuredMailAddress}',
  insureddetails.InsuredMobileNo1='${InsuredMobileNo}',
  driverdetails.DriverName='${DriverName}',
  driverdetails.LicenseNumber='${LicenseNumber}',
  driverdetails.DateOfIssue='${DateOfIssue}',
  driverdetails.IssuingAuthority='${IssuingAuthority}',
  driverdetails.LicenseType='${LicenseType}',
  driverdetails.ValidUpto='${ValidUpto}',
  vehicledetails.RegisteredNumber='${RegisteredNumber}',
  vehicledetails.ChassisNumber='${ChassisNumber}',
  vehicledetails.EngineNumber='${EngineNumber}',
  vehicledetails.MakerDesc='${MakerDesc}',
  vehicledetails.MakerModel='${MakerModel}',
  vehicledetails.TypeOfBody='${TypeOfBody}',
  vehicledetails.VehicleClassDescription='${VehicleClassDescription}',
  vehicledetails.PucNumber='${PucNumber}',
  vehicledetails.PucValidUntil='${PucValidUntil}',
  vehicledetails.SeatingCapacity='${SeatingCapacity}',
  vehicledetails.DateOfRegistration='${DateOfRegistration}',
  accidentdetails.CauseOfAccident='${CauseOfAccident}',
  accidentdetails.DateOfAccident='${DateOfAccident}',
  accidentdetails.TimeOfAccident='${TimeOfAccident}',
  accidentdetails.PlaceOfSurvey='${PlaceOfSurvey}'  
WHERE
  claimdetails.LeadID = ${LeadID}`;

 db.query(updateClaimDetails, (err, result2) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, data: null, message: "Internal Server Error" });
    }
    if (result2.affectedRows == 0) {
      return res.status(400).json({ status: false, data: result2, message: "survey not found!!" })
    } else{
      res.status(200).json({ status: true, data: result2, message: "Successfully Updated!!" })
    }
  });

};

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

  const sql = `SELECT 
    claimdetails.LeadID,
    IFNULL(claimdetails.ReferenceNo, '') AS ReferenceNo,
    IFNULL(claimdetails.PolicyNumber, '') AS PolicyNumber,
    IFNULL(claimdetails.PolicyPeriodStart, '') AS PolicyPeriodStart,
    IFNULL(claimdetails.PolicyPeriodEnd, '') AS PolicyPeriodEnd,
    IFNULL(claimdetails.ClaimNumber, '') AS ClaimNumber,
    IFNULL(claimdetails.IDV, 0.0) AS IDV,
    IFNULL(insureddetails.InsuredAddress, '') AS InsuredAddress,
    IFNULL(insureddetails.InsuredName, '') AS InsuredName,
    IFNULL(insureddetails.InsuredMailAddress, '') AS InsuredMailAddress,
    IFNULL(insureddetails.InsuredMobileNo1, '') AS InsuredMobileNo,
    IFNULL(driverdetails.DriverName, '') AS DriverName,
    IFNULL(driverdetails.LicenseNumber, '') AS LicenseNumber,
    IFNULL(driverdetails.DateOfIssue, '') AS DateOfIssue,
    IFNULL(driverdetails.IssuingAuthority, '') AS IssuingAuthority,
    IFNULL(driverdetails.LicenseType, '') AS LicenseType,
    IFNULL(driverdetails.ValidUpto, '') AS ValidUpto,
    IFNULL(vehicledetails.RegisteredNumber, '') AS RegisteredNumber,
    IFNULL(vehicledetails.ChassisNumber, '') AS ChassisNumber,
    IFNULL(vehicledetails.EngineNumber, '') AS EngineNumber,
    IFNULL(vehicledetails.MakerDesc, '') AS MakerDesc,
    IFNULL(vehicledetails.MakerModel, '') AS MakerModel,
    IFNULL(vehicledetails.TypeOfBody, '') AS TypeOfBody,
    IFNULL(vehicledetails.VehicleClassDescription, '') AS VehicleClassDescription,
    IFNULL(vehicledetails.PucNumber, '') AS PucNumber,
    IFNULL(vehicledetails.PucValidUntil, '') AS PucValidUntil,
    IFNULL(vehicledetails.SeatingCapacity, 0) AS SeatingCapacity,
    IFNULL(vehicledetails.DateOfRegistration, '') AS DateOfRegistration,
    IFNULL(accidentdetails.CauseOfAccident, '') AS CauseOfAccident,
    IFNULL(accidentdetails.DateOfAccident, '') AS DateOfAccident,
    IFNULL(accidentdetails.TimeOfAccident, '') AS TimeOfAccident,
    IFNULL(accidentdetails.PlaceOfSurvey, '') AS PlaceOfSurvey
FROM
    claimdetails
        LEFT JOIN
    insureddetails ON claimdetails.LeadID = insureddetails.LeadID
        LEFT JOIN
    driverdetails ON claimdetails.LeadID = driverdetails.LeadID
        LEFT JOIN
    vehicledetails ON claimdetails.LeadID = vehicledetails.LeadID
        LEFT JOIN
    claimstatus ON claimdetails.LeadID = claimstatus.LeadID
        LEFT JOIN
    accidentdetails ON claimdetails.LeadID = accidentdetails.LeadID
WHERE
    claimdetails.LeadID = ?
        AND claimdetails.IsActive = TRUE
        AND claimdetails.IsClaimCompleted = FALSE`;

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

module.exports = { surveyDetails, updateSurveyDetails };