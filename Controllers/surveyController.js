
const db = require("../Config/dbConfig");


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

  const updateClaimDetails = `UPDATE ClaimDetails 
  LEFT JOIN
  InsuredDetails ON ClaimDetails.LeadID = InsuredDetails.LeadID
      LEFT JOIN
  DriverDetails ON ClaimDetails.LeadID = DriverDetails.LeadID
      LEFT JOIN
  VehicleDetails ON ClaimDetails.LeadID = VehicleDetails.LeadID
      LEFT JOIN
  ClaimStatus ON ClaimDetails.LeadID = ClaimStatus.LeadID
      LEFT JOIN
  AccidentDetails ON ClaimDetails.LeadID = AccidentDetails.LeadID
  SET
  ClaimDetails.ReferenceNo='${ReferenceNo}',
  ClaimDetails.PolicyNumber='${PolicyNumber}',
  ClaimDetails.PolicyPeriodStart='${PolicyPeriodStart}',
  ClaimDetails.PolicyPeriodEnd='${PolicyPeriodEnd}',
  ClaimDetails.ClaimNumber='${ClaimNumber}',
  ClaimDetails.IDV='${IDV}',
  InsuredDetails.InsuredAddress='${InsuredAddress}',
  InsuredDetails.InsuredName='${InsuredName}',
  InsuredDetails.InsuredMailAddress='${InsuredMailAddress}',
  InsuredDetails.InsuredMobileNo1='${InsuredMobileNo}',
  DriverDetails.DriverName='${DriverName}',
  DriverDetails.LicenseNumber='${LicenseNumber}',
  DriverDetails.DateOfIssue='${DateOfIssue}',
  DriverDetails.IssuingAuthority='${IssuingAuthority}',
  DriverDetails.LicenseType='${LicenseType}',
  DriverDetails.ValidUpto='${ValidUpto}',
  VehicleDetails.RegisteredNumber='${RegisteredNumber}',
  VehicleDetails.ChassisNumber='${ChassisNumber}',
  VehicleDetails.EngineNumber='${EngineNumber}',
  VehicleDetails.MakerDesc='${MakerDesc}',
  VehicleDetails.MakerModel='${MakerModel}',
  VehicleDetails.TypeOfBody='${TypeOfBody}',
  VehicleDetails.VehicleClassDescription='${VehicleClassDescription}',
  VehicleDetails.PucNumber='${PucNumber}',
  VehicleDetails.PucValidUntil='${PucValidUntil}',
  VehicleDetails.SeatingCapacity='${SeatingCapacity}',
  VehicleDetails.DateOfRegistration='${DateOfRegistration}',
  AccidentDetails.CauseOfAccident='${CauseOfAccident}',
  AccidentDetails.DateOfAccident='${DateOfAccident}',
  AccidentDetails.TimeOfAccident='${TimeOfAccident}',
  AccidentDetails.PlaceOfSurvey='${PlaceOfSurvey}'  
WHERE
  ClaimDetails.LeadID = ${LeadID}`;

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
    ClaimDetails.LeadID,
    IFNULL(ClaimDetails.ReferenceNo, '') AS ReferenceNo,
    IFNULL(ClaimDetails.PolicyNumber, '') AS PolicyNumber,
    IFNULL(ClaimDetails.PolicyPeriodStart, '') AS PolicyPeriodStart,
    IFNULL(ClaimDetails.PolicyPeriodEnd, '') AS PolicyPeriodEnd,
    IFNULL(ClaimDetails.ClaimNumber, '') AS ClaimNumber,
    IFNULL(ClaimDetails.IDV, 0.0) AS IDV,
    IFNULL(InsuredDetails.InsuredAddress, '') AS InsuredAddress,
    IFNULL(InsuredDetails.InsuredName, '') AS InsuredName,
    IFNULL(InsuredDetails.InsuredMailAddress, '') AS InsuredMailAddress,
    IFNULL(InsuredDetails.InsuredMobileNo1, '') AS InsuredMobileNo,
    IFNULL(DriverDetails.DriverName, '') AS DriverName,
    IFNULL(DriverDetails.LicenseNumber, '') AS LicenseNumber,
    IFNULL(DriverDetails.DateOfIssue, '') AS DateOfIssue,
    IFNULL(DriverDetails.IssuingAuthority, '') AS IssuingAuthority,
    IFNULL(DriverDetails.LicenseType, '') AS LicenseType,
    IFNULL(DriverDetails.ValidUpto, '') AS ValidUpto,
    IFNULL(VehicleDetails.RegisteredNumber, '') AS RegisteredNumber,
    IFNULL(VehicleDetails.ChassisNumber, '') AS ChassisNumber,
    IFNULL(VehicleDetails.EngineNumber, '') AS EngineNumber,
    IFNULL(VehicleDetails.MakerDesc, '') AS MakerDesc,
    IFNULL(VehicleDetails.MakerModel, '') AS MakerModel,
    IFNULL(VehicleDetails.TypeOfBody, '') AS TypeOfBody,
    IFNULL(VehicleDetails.VehicleClassDescription, '') AS VehicleClassDescription,
    IFNULL(VehicleDetails.PucNumber, '') AS PucNumber,
    IFNULL(VehicleDetails.PucValidUntil, '') AS PucValidUntil,
    IFNULL(VehicleDetails.SeatingCapacity, 0) AS SeatingCapacity,
    IFNULL(VehicleDetails.DateOfRegistration, '') AS DateOfRegistration,
    IFNULL(AccidentDetails.CauseOfAccident, '') AS CauseOfAccident,
    IFNULL(AccidentDetails.DateOfAccident, '') AS DateOfAccident,
    IFNULL(AccidentDetails.TimeOfAccident, '') AS TimeOfAccident,
    IFNULL(AccidentDetails.PlaceOfSurvey, '') AS PlaceOfSurvey
FROM
    ClaimDetails
        LEFT JOIN
    InsuredDetails ON ClaimDetails.LeadID = InsuredDetails.LeadID
        LEFT JOIN
    DriverDetails ON ClaimDetails.LeadID = DriverDetails.LeadID
        LEFT JOIN
    VehicleDetails ON ClaimDetails.LeadID = VehicleDetails.LeadID
        LEFT JOIN
    ClaimStatus ON ClaimDetails.LeadID = ClaimStatus.LeadID
        LEFT JOIN
    AccidentDetails ON ClaimDetails.LeadID = AccidentDetails.LeadID
WHERE
    ClaimDetails.LeadID = ?
        AND ClaimDetails.IsActive = TRUE
        AND ClaimDetails.IsClaimCompleted = FALSE`;

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