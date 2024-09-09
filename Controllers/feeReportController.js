const db = require("../Config/dbConfig");

const upload = (req, res) => {
  const {
    LeadId,
    Type,
    ProfessionalFees,
    TotalKM,
    Visits,
    Conveyance,
    Photos,
    Charge,
    Photos_cd,
    Cgst,
    Igst,
    Sgst,
    Total,
    ModeOfpayement,
    BillID,
    FeebasedOn,
    Remrk,
    KmRate,
    PhotsRate,
    EstimateAmt,
    AssessedAmt,
    InsuranceCompanyName,
    Branch,
    BillTo,
    Others,
    BillDate,
    BillId,
  } = req.body;

  const insertQuery = `INSERT INTO BillReportFees (
     Type,
     ProfessionalFees,
     TotalKM,
     Visits,
     Conveyance,
     Photos,
     Charge,
     Photos_cd,
     Cgst,
     Igst,
     Sgst,
     Total,
     FeebasedOn,
     Remrk,
     KmRate,
     PhotsRate,
     EstimateAmt,
     AssessedAmt,
     InsuranceCompanyName,
     Branch,
     BillTo,
     Others,
     BillDate,
     LeadId
 ) VALUES (
     '${Type}',
     '${ProfessionalFees}',
     '${TotalKM}',
     '${Visits}',
     '${Conveyance}',
     '${Photos}',
     '${Charge}',
     '${Photos_cd}',
     '${Cgst}',
     '${Igst}',
     '${Sgst}',
     '${Total}',
     '${FeebasedOn}',
     '${Remrk}',
     '${KmRate}',
     '${PhotsRate}',
     '${EstimateAmt}',
     '${AssessedAmt}',
     '${InsuranceCompanyName}',
     '${Branch}',
     '${BillTo}',
     '${Others}',
     '${BillDate}',
     '${LeadId}'
 );`;

  const updateQuery = `
 UPDATE BillReportFees
 SET
   Type = '${Type}',
   ProfessionalFees = ${ProfessionalFees},
   TotalKM = '${TotalKM}',
   Visits = '${Visits}',
   Conveyance = '${Conveyance}',
   Photos = '${Photos}',
   Charge = '${Charge}',
   Photos_cd = '${Photos_cd}',
   Cgst = '${Cgst}',
   Igst = '${Igst}',
   Sgst = '${Sgst}',
   Total = '${Total}',
   FeebasedOn = '${FeebasedOn}',
   Remrk = '${Remrk}',
   KmRate = '${KmRate}',
   PhotsRate = '${PhotsRate}',
   EstimateAmt = '${EstimateAmt}',
   AssessedAmt = '${AssessedAmt}',
   InsuranceCompanyName = '${InsuranceCompanyName}',
   Branch = '${Branch}',
   BillTo = '${BillTo}',
   Others = '${Others}',
   BillDate = '${BillDate}'
   WHERE LeadID = ${LeadId};
`;

  db.query(
    "SELECT * FROM BillReportFees WHERE LeadID=?",
    [LeadId],
    (err, result_1) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      const query = result_1.length > 0 ? updateQuery : insertQuery;

      db.query(query, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
      });

      let finalResult = {};
      if (BillId === null) {
        db.query(
          "CALL InsertIntobillIDTable(?)",
          [LeadId],
          (error, result12) => {
            if (error) {
              console.error("Error while updating the billId", error);
              return res.status(500).json({
                error: "Error while updating the billId",
              });
            }
            finalResult = result12;
          }
        );
      }
      return res.status(200).json({
        message: "Successfully uploaded the fee report!",
        finalResult,
      });
    }
  );
};

const getFeeReport = async (req, res) => {
  const leadId = req.query.LeadId;

  const executeQuery = (query, values) => {
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
    });
  };

  try {
    const feeDetails = await executeQuery(
      "SELECT * FROM BillReportFees WHERE LeadID=?",
      [leadId]
    );
    const driverDetails = await executeQuery(
      "SELECT * FROM DriverDetailsOnline WHERE LeadID=?",
      [leadId]
    );
    const vehicleOnlineDetails = await executeQuery(
      "SELECT * FROM VehicleDetailsOnline WHERE LeadId=?",
      [leadId]
    );
    const labourDetails = await executeQuery("CALL GetLabourReport(?)", [
      leadId,
    ]);
    const newPartsDetails = await executeQuery("CALL GetNewPartsReport(?)", [
      leadId,
    ]);
    const vehicleDetails = await executeQuery(
      "SELECT * FROM VehicleDetails WHERE LeadId=?",
      [leadId]
    );
    const accidentDetails = await executeQuery(
      "SELECT * FROM AccidentDetails WHERE LeadID=?",
      [leadId]
    );

    const claimDetails = await executeQuery(
      "SELECT * FROM ClaimDetails WHERE LeadId=?",
      [leadId]
    );

    const insuredDetails = await executeQuery(
      "SELECT * FROM InsuredDetails WHERE LeadId=?",
      [leadId]
    );

    const SummaryDetails = await executeQuery(
      "SELECT * FROM SummaryReport WHERE LeadId=?",
      [leadId]
    );

    const combinedResult = {
      feeDetails,
      driverDetails,
      labourDetails,
      newPartsDetails,
      claimDetails,
      vehicleDetails,
      vehicleOnlineDetails,
      feeDetails,
      insuredDetails,
      SummaryDetails,
      accidentDetails: accidentDetails,
    };

    res.json(combinedResult);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { upload, getFeeReport };
