const db = require("../Config/dbConfig");
const axios = require("axios");

const generateUniqueToken = require("../Config/generateToken");
const { formatDate } = require("../Config/getFormattedDate");

const addClaim = (req, res) => {
  const {
    SurveyType,
    ReferenceNo,
    PolicyIssuingOffice,
    PolicyNumber,
    PolicyPeriodStart,
    PolicyPeriodEnd,
    ClaimNumber,
    BrokerMailAddress,
    ClaimServicingOffice,
    AddedBy,
    Region,
    InspectionType,
    IsClaimCompleted,
    IsActive,
    InsuredName,
    InsuredMobileNo1,
    InsuredMobileNo2,
    InsuredMailAddress,
    InsuredAddress,
    GarageMailAddress,
    RegisteredNumber,
    GarageNameAndAddress,
    GarageContactNo1,
    GarageContactNo2,
    PlaceOfLoss,
    NatureOfLoss,
    EstimatedLoss,
  } = req.body;

  const authorizationHeader = req.headers.authorization;

  const token = authorizationHeader.substring("Bearer ".length);

  const generatedToken = generateUniqueToken();

  const formattedPolicyStart = formatDate(PolicyPeriodStart);
  const formattedPolicyEnd = formatDate(PolicyPeriodEnd);

  const insertClaimDetails = `
      INSERT INTO ClaimDetails (
        SurveyType,
        ReferenceNo,
        PolicyNumber,
        PolicyPeriodStart,
        PolicyPeriodEnd,
        ClaimServicingOffice,
        AddedBy,
        ClaimNumber,
        Region,
        InspectionType,
        IsClaimCompleted,
        BrokerMailAddress,
        InsuredToken,
        PolicyIssuingOffice,
        PolicyType,
        IsActive
      ) VALUES (
        '${SurveyType}',
        '${ReferenceNo}',
        '${PolicyNumber}',
        '${formattedPolicyStart}',
        '${formattedPolicyEnd}',
        '${ClaimServicingOffice}',
        '${AddedBy}',
      '${ClaimNumber}',
        '${Region}',
        '${InspectionType}',
        ${parseInt(IsClaimCompleted)},
        '${BrokerMailAddress}',
        '${generatedToken}',
        '${PolicyIssuingOffice}',
        'Regular',
        ${parseInt(IsActive)}
      );
    `;

  db.query(insertClaimDetails, (error, results) => {
    if (error) {
      console.error("Error inserting data into ClaimDetails:", error);
      return res
        .status(500)
        .json({ error: "Error inserting data into ClaimDetails." });
    }

    db.query(
      "SELECT LeadId FROM ClaimDetails ORDER BY LeadId DESC LIMIT 1",
      (error, results) => {
        if (error) {
          console.error("Error inserting data into ClaimDetails:", error);
          return res
            .status(500)
            .json({ error: "Error inserting data into ClaimDetails." });
        }
        const addLeadId = results[0].LeadId;

        const newReferenceNo = ReferenceNo + `/${parseInt(results[0].LeadId)}`;

        const updateClaimDetails = `
          UPDATE ClaimDetails
          SET
          ReferenceNo = '${newReferenceNo ? `${newReferenceNo}` : ""}'
          WHERE LeadId = ${parseInt(results[0].LeadId)};
          `;

        const insertVehicleDetails = `
          INSERT INTO VehicleDetails (
            RegisteredNumber,
            LeadId 
          ) VALUES (
            '${RegisteredNumber}',
            ${parseInt(results[0].LeadId)}
          );
        `;

        const statusDetails = `
          INSERT INTO ClaimStatus (
            Status,
            SubStatus,
            LeadId 
          ) VALUES (
            ${1},
            ${2},
            ${parseInt(results[0].LeadId)}
          );
        `;

        const insertGarageDetails = `
          INSERT INTO GarageDetails (
            GarageNameAndAddress,
            GarageContactNo1,
            GarageContactNo2,
            GarageMailAddress,
            LeadId 
          ) VALUES (
            '${GarageNameAndAddress}',
          '${GarageContactNo1}',
            '${GarageContactNo2}',
            '${GarageMailAddress}',
            ${parseInt(results[0].LeadId)}
          );
        `;

        const insertAccidentDetails = `
          INSERT INTO AccidentDetails (
            PlaceOfLoss,
            NatureOfLoss,
            EstimatedLoss,
            LeadId
          ) VALUES (
            '${PlaceOfLoss}',
            '${NatureOfLoss}',
            '${EstimatedLoss}',
            ${parseInt(results[0].LeadId)}
          );
        `;

        const insertDriverDetails = `
          INSERT INTO DriverDetails (
            LeadId
          ) VALUES (
            ${parseInt(results[0].LeadId)}
          );
        `;

        const insertFeeDetails = `
        INSERT INTO BillReportFees (
          LeadID
        ) VALUES (
          ${parseInt(results[0].LeadId)}
        );
      `;

        const insertInsuredDetails = `
      INSERT INTO InsuredDetails (
        InsuredName,
        InsuredMobileNo1,
        InsuredMobileNo2,
        InsuredMailAddress,
        LeadId
      ) VALUES (
        '${InsuredName}',
        '${InsuredMobileNo1}',
        '${InsuredMobileNo2}',
        '${InsuredMailAddress}',
        ${parseInt(results[0].LeadId)}
      );
    `;

        const insertCommercialDetails = `
    INSERT INTO CommercialVehicleDetails (
      LeadId
    ) VALUES (
      ${parseInt(results[0].LeadId)}
    );
  `;

        db.query(insertVehicleDetails, (error, results) => {
          if (error) {
            console.error("Error inserting data into VehicleDetails:", error);
            return res
              .status(500)
              .json({ error: "Error inserting data into VehicleDetails." });
          }

          db.query(insertGarageDetails, (error, results) => {
            if (error) {
              console.error("Error inserting data into GarageDetails:", error);
              return res
                .status(500)
                .json({ error: "Error inserting data into GarageDetails." });
            }

            db.query(insertAccidentDetails, (error, results) => {
              if (error) {
                console.error(
                  "Error inserting data into AccidentDetails:",
                  error
                );
                return res.status(500).json({
                  error: "Error inserting data into AccidentDetails.",
                });
              }

              db.query(insertCommercialDetails, (error, results) => {
                if (error) {
                  console.error(
                    "Error inserting data into CommercialDetails:",
                    error
                  );
                  return res.status(500).json({
                    error: "Error inserting data into CommercialDetails.",
                  });
                }
              });

              db.query(insertInsuredDetails, (error, results) => {
                if (error) {
                  console.error(
                    "Error inserting data into InsuredDetails:",
                    error
                  );
                  return res.status(500).json({
                    error: "Error inserting data into InsuredDetails.",
                  });
                }

                db.query(insertFeeDetails, (error, results) => {
                  if (error) {
                    console.error(
                      "Error inserting data into FeeDetails:",
                      error
                    );
                    return res.status(500).json({
                      error: "Error inserting data into FeeDetails.",
                    });
                  }
                });

                db.query(updateClaimDetails, (error, results) => {
                  if (error) {
                    console.error(
                      "Error updating the reference No  into ClaimDetails:",
                      error
                    );
                    return res.status(500).json({
                      error:
                        "Error updating the reference No  into ClaimDetails.",
                    });
                  }
                });

                db.query("CALL InsertIntoIDTable()", (error, result12) => {
                  if (error) {
                    console.error("Error inserting reference no", error);
                    return res.status(500).json({
                      error: "Error inserting reference no",
                    });
                  }
                });

                db.query(statusDetails, (error, results) => {
                  db.query(insertDriverDetails, (error, results) => {
                    if (error) {
                      console.error(
                        "Error inserting data into DriverDetails:",
                        error
                      );
                      return res.status(500).json({
                        error: "Error inserting data into DriverDetails.",
                      });
                    }

                    if (InsuredMailAddress !== "" && RegisteredNumber && addLeadId ) {
                      axios
                        .post(
                          `${process.env.BACKEND_DOMAIN}/email/sendEmail/1`,
                          {
                            vehicleNo: RegisteredNumber,
                            PolicyNo: PolicyNumber,
                            Insured: InsuredName,
                            toMail: InsuredMailAddress,
                            Date: new Date(),
                            leadId: addLeadId,
                            Region: Region,
                            BrokerMailAddress: BrokerMailAddress,
                            GarageMailAddress: GarageMailAddress,
                            type: 1,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                            },
                          }
                        )
                        .then((ressss) => {
                          console.log(ressss);
                        })
                        .catch((Er) => {
                          return res.status(500).json({
                            error:
                              "Error sending email into Acknowldegment Mail.",
                          });
                        });
                    }

                    return res.status(200).json({
                      message: "Data inserted successfully.",
                    });
                  });
                });
              });
            });
          });
        });
      }
    );
  });
};

const getSpecificClaim = async (req, res) => {
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
    const claimDetails = await executeQuery(
      "SELECT * FROM ClaimDetails WHERE LeadID=?",
      [leadId]
    );
    const totalLoss = await executeQuery(
      "SELECT * FROM TotalLoss WHERE LeadID=?",
      [leadId]
    );
    const insuredDetails = await executeQuery(
      "SELECT * FROM InsuredDetails WHERE LeadID=?",
      [leadId]
    );
    const accidentDetails = await executeQuery(
      "SELECT * FROM AccidentDetails WHERE LeadID=?",
      [leadId]
    );
    const driverDetails = await executeQuery(
      `SELECT 
        LicenseNumber,
        DriverName,
        Vov,
        ValidUpto,
        RtoName,
        Address,
        Mobile,
        BloodGroup,
        Gender,
        FatherName,
        DateOfBirth,
        DateOfIssue,
        IssuingAuthority,
        BadgeNumber,
        Remark,
        LicenseType,
        DateOfBirth,
        TypeOfverification,
        ValidUpto,
        DLStatus,
        LeadID
        FROM DriverDetails WHERE LeadID=?`,
      [leadId]
    );
    const vehicleOnlineDetails = await executeQuery(
      `SELECT RegisteredNumber,
        TypeOfBody,
        DateOfRegistration,
        EngineNumber,
        ChassisNumber,
        FuelType,
        MakerDesc,
        MakerModel,
        CubicCapacity,
        SeatingCapacity,
        FitUpto,
        PasiaModelCode,
        VehicleType,
        BancsModelCode,
        BancsMakeCode,
        BancsSubtypeCode,
        BancsBodyType,
        BancsVehicleClass,
        BancsVehicleSegment,
        RcRtoCode,
        VehicleRcStatus,
        VehicleBlackListStatus,
        VehicleRegistedAt,
        ManufactureMonthYear,
        PermanentAddress,
        ClassOfVehicle,
        RegisteredOwner,
        VehicleInsuranceUpto,
        PucValidUntil,
        PucNumber,
        VehicleInsuranceCompany,
        MakeVariantModelColor,
        TaxParticulars,
        TypeOfVerification,
        VehicleClassDescription,
        ApiResponse,
        LeadId
         FROM VehicleDetailsOnline WHERE LeadId=?`,
      [leadId]
    );
    const driverOnlineDetails = await executeQuery(
      `SELECT 
        LicenseNumber,
        DriverName,
        Vov,
        ValidUpto,
        RtoName,
        Address,
        Mobile,
        BloodGroup,
        Gender,
        FatherName,
        DateOfBirth,
        DateOfIssue,
        IssuingAuthority,
        BadgeNumber,
        Remark,
        LicenseType,
        ApiResponse
        FROM DriverDetailsOnline WHERE LeadID=?`,
      [leadId]
    );
    const vehicleDetails = await executeQuery(
      `SELECT  
        RegisteredNumber,
        TypeOfBody,
        DateOfRegistration,
        EngineNumber,
        ChassisNumber,
        FuelType,
        MakerDesc,
        MakerModel,
        CubicCapacity,
        SeatingCapacity,
        FitUpto,
        PasiaModelCode,
        VehicleType,
        BancsModelCode,
        BancsMakeCode,
        BancsSubtypeCode,
        BancsBodyType,
        BancsVehicleClass,
        BancsVehicleSegment,
        RcRtoCode,
        VehicleRcStatus,
        VehicleBlackListStatus,
        VehicleRegistedAt,
        ManufactureMonthYear,
        PermanentAddress,
        ClassOfVehicle,
        RegisteredOwner,
        VehicleInsuranceUpto,
        PucValidUntil,
        PucNumber,
        VehicleInsuranceCompany,
        MakeVariantModelColor,
        TaxParticulars,
        OwnerSrDate,
        RegLadenWt,
        RemarkIfRLW,
        UnladenWT,
        RemarkIfULW,
        Remark,
        OdometerReading,
        AntiTheft,
        PreAccidentCondition,
        FitUpto,
        TransferDate,
        AddedBy,
        VehicleClassDescription,
        LeadID

        FROM VehicleDetails WHERE LeadID=?`,
      [leadId]
    );
    const garageDetails = await executeQuery(
      "SELECT * FROM GarageDetails WHERE LeadID=?",
      [leadId]
    );
    const summaryDetails = await executeQuery(
      "SELECT * FROM SummaryReport WHERE LeadId=?",
      [leadId]
    );
    const claimStatus = await executeQuery(
      "SELECT * FROM ClaimStatus WHERE LeadID=?",
      [leadId]
    );

    const commercialVehicleDetails = await executeQuery(
      "SELECT * FROM CommercialVehicleDetails WHERE LeadID=?",
      [leadId]
    );

    const combinedResult = {
      claimDetails,
      insuredDetails,
      accidentDetails: accidentDetails,
      driverDetails,
      vehicleDetails,
      totalLoss,
      garageDetails: garageDetails,
      claimStatus,
      vehicleOnlineDetails,
      driverOnlineDetails,
      commercialVehicleDetails,
      summaryDetails,
    };

    res.json(combinedResult);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const updateClaim = async (req, res) => {
  const {
    InsuredName,
    InsuredMailAddress,
    InsuredMobileNo1,
    InsuredMobileNo2,
    ClaimNumber,
    PolicyIssuingOffice,
    ClaimRegion,
    ClaimServicingOffice,
    InspectionType,
    SurveyType,
    PolicyPeriodStart,
    PolicyPeriodEnd,
    CubicCapacity,
    InsuranceCompanyNameAddress,
    InsuredAddedBy,
    VehicleMakeVariantModelColor,
    VehicleTypeOfBody,
    VehicleRegisteredNumber,
    VehicleDateOfRegistration,
    VehiclePucNumber,
    VehicleRegisteredOwner,
    VehicleTransferDate,
    VehicleEngineNumber,
    VehicleAddedBy,
    IssuingAuthority,
    LicenseNumber,
    LicenseType,
    VehicleChassisNumber,
    VehicleFuelType,
    DriverName,
    DriverAddedDate,
    DriverTypeOfVerification,
    GarageNameAndAddress,
    GarageAddedBy,
    GarageContactNo1,
    GarageContactNo2,
    VehicleClassDescription,
    MakerDesc,
    MakerModel,
    ManufactureMonth,
    VehicleGvw,
    VehicleCubicCap,
    VehicleSeatingCapacity,
    VehiclePermanentAddress,
    FitUpto,
    PasiaModelCode,
    RcInsuranceComp,
    RcInsuranceUpto,
    RcRegisteredAt,
    RcBlacklistStatus,
    RcVehicleType,
    BancsModelCode,
    BancsMakeCode,
    BancsSubtypeCode,
    BancsBodyType,
    BancsVehicleClass,
    BancsVehicleSegment,
    RcRtoCode,
    VehicleRcStatus,
    VehicleBlackListStatus,
    VehicleRegistedAt,
    VehicleInsuranceCompany,
    ManufactureMonthYear,
    PermanentAddress,
    ClassOfVehicle,
    insuredAddedBy,
    SeatingCapacity,
    FatherName,
    Gender,
    BloodGroup,
    Mobile,
    Address,
    RtoName,
    ValidUpto,
    ValidFrom,
    driverRemark,
    DateOfBirth,
    Vov,
    Photo,
    Pht,
    BadgeNumber,
    IsDriverDetailsFetched,
    IsRcDetailsFetched,
    DateOfIssue,
    GarageMailAddress,
    BrokerMailAddress,
    LeadId,
  } = req.body;

  const formattedPolicyEnd = formatDate(PolicyPeriodEnd);
  const formattedPolicyStart = formatDate(PolicyPeriodStart);
  const formattedDateOfRegistration = formatDate(VehicleDateOfRegistration);
  const formattedTransferDate = format(VehicleTransferDate);
  const formattedFitUpto = formatDate(FitUpto);
  const formattedInsuranceUpto = formatDate(RcInsuranceUpto);
  const formattedMonthYear = formatDate(ManufactureMonthYear);
  const formattedDateOfbirth = formatDate(DateOfBirth);
  const formattedDateOfIssue = formatDate(DateOfIssue);
  const formattedValidupto = formatDate(ValidFrom);
  const formattedDriverAddedDate = formatDate(DriverAddedDate);

  const updateClaimDetails = `
    UPDATE ClaimDetails
    SET
    PolicyIssuingOffice = ${
      PolicyIssuingOffice ? `${PolicyIssuingOffice}` : ""
    },
    Region = '${ClaimRegion}',
    ClaimServicingOffice = ${
      ClaimServicingOffice ? `${ClaimServicingOffice}` : ""
    },
    InspectionType = '${InspectionType}',
    SurveyType = '${SurveyType}',
    PolicyPeriodStart = ${
      formattedPolicyStart ? `${formattedPolicyStart}` : ""
    },
    PolicyPeriodEnd = ${formattedPolicyEnd ? `${formattedPolicyEnd}` : ""},
    IsDriverDetailsFetched = ${
      IsDriverDetailsFetched ? IsDriverDetailsFetched : ""
    },
    IsRcDetailsFetched = ${IsRcDetailsFetched ? IsRcDetailsFetched : ""},
    InsuranceCompanyNameAddress = ${
      InsuranceCompanyNameAddress ? `${InsuranceCompanyNameAddress}` : ""
    }
    BrokerMailAddress =${BrokerMailAddress ? `${BrokerMailAddress}` : ""},
    WHERE LeadId = ${LeadId};
  `;

  // Update DriverDetails
  const updateDriverDetails = `
    UPDATE DriverDetails
    SET
    IssuingAuthority = ${IssuingAuthority ? `${IssuingAuthority}` : ""},
    LicenseNumber = '${LicenseNumber}',
    LicenseType = '${LicenseType}',
    DriverName = '${DriverName}',
    AddedDate = ${
      formattedDriverAddedDate ? `${formattedDriverAddedDate}` : ""
    },
    Pht = ${Pht ? `${Pht}` : ""},
    Photo = ${Photo ? `${Photo}` : ""},
    Vov = ${Vov ? `${Vov}` : ""},
    ValidUpto = ${formattedValidupto ? `${formattedValidupto}` : ""},
    RtoName = ${RtoName ? `${RtoName}` : ""},
    Address = ${Address ? `${Address}` : ""},
    Mobile = ${Mobile ? `${Mobile}` : ""},
    BloodGroup = ${BloodGroup ? `${BloodGroup}` : ""},
    Gender = ${Gender ? `${Gender}` : ""},
    FatherName = ${FatherName ? `${FatherName}` : ""},
    BadgeNumber='${BadgeNumber}',
    DateOfBirth = ${formattedDateOfbirth ? `${formattedDateOfbirth}` : ""},
    DateOfIssue = ${formattedDateOfIssue ? `${formattedDateOfIssue}` : ""},
    TypeOfVerification = '${DriverTypeOfVerification}'
    WHERE LeadID = ${LeadId};
  `;

  // Update VehicleDetails
  const updateVehicleDetails = `
  UPDATE VehicleDetails
  SET 
    RegisteredNumber = ${
      VehicleRegisteredNumber ? `${VehicleRegisteredNumber}` : ""
    },
    MakeVariantModelColor = ${
      VehicleMakeVariantModelColor ? `${VehicleMakeVariantModelColor}` : ""
    },
    TypeOfBody = ${VehicleTypeOfBody ? `${VehicleTypeOfBody}` : ""},
    DateOfRegistration = ${
      formattedDateOfRegistration ? `${formattedDateOfRegistration}` : ""
    },
    TransferDate = ${formattedTransferDate ? `${formattedTransferDate}` : ""},
    EngineNumber = ${VehicleEngineNumber ? `${VehicleEngineNumber}` : ""},
    AddedBy = ${VehicleAddedBy ? `${VehicleAddedBy}` : ""},
    ChassisNumber = ${VehicleChassisNumber ? `${VehicleChassisNumber}` : ""},
    FuelType = ${VehicleFuelType ? `${VehicleFuelType}` : ""},
    MakerDesc = ${MakerDesc ? `${MakerDesc}` : ""},
    MakerModel = ${MakerModel ? `${MakerModel}` : ""},
    CubicCapacity = ${CubicCapacity ? `${CubicCapacity}` : ""},
    FitUpto = ${formattedFitUpto ? `${formattedFitUpto}` : ""},
    PasiaModelCode = ${PasiaModelCode ? `${PasiaModelCode}` : ""},
    VehicleType = ${RcVehicleType ? `${RcVehicleType}` : ""},
    BancsModelCode = ${BancsModelCode ? `${BancsModelCode}` : ""},
    BancsMakeCode = ${BancsMakeCode ? `${BancsMakeCode}` : ""},
    BancsSubtypeCode = ${BancsSubtypeCode ? `${BancsSubtypeCode}` : ""},
    BancsBodyType = ${BancsBodyType ? `${BancsBodyType}` : ""},
    BancsVehicleClass = ${BancsVehicleClass ? `${BancsVehicleClass}` : ""},
    BancsVehicleSegment = ${
      BancsVehicleSegment ? `${BancsVehicleSegment}` : ""
    },
    RcRtoCode = ${RcRtoCode ? `${RcRtoCode}` : ""},
    VehicleRcStatus = ${VehicleRcStatus ? `${VehicleRcStatus}` : ""},
    VehicleBlackListStatus = ${
      VehicleBlackListStatus ? `${VehicleBlackListStatus}` : ""
    },
    VehicleRegistedAt = ${VehicleRegistedAt ? `${VehicleRegistedAt}` : ""},
    VehicleInsuranceCompany = ${
      VehicleInsuranceCompany ? `${VehicleInsuranceCompany}` : ""
    },
    ManufactureMonthYear = ${formattedMonthYear ? `${formattedMonthYear}` : ""},
    PermanentAddress = ${PermanentAddress ? `${PermanentAddress}` : ""},
    ClassOfVehicle = ${ClassOfVehicle ? `${ClassOfVehicle}` : ""},
    RegisteredOwner = ${
      VehicleRegisteredOwner ? `${VehicleRegisteredOwner}` : ""
    },
    SeatingCapacity = ${SeatingCapacity ? `${SeatingCapacity}` : ""},
    VehicleInsuranceUpto = ${
      formattedInsuranceUpto ? `${formattedInsuranceUpto}` : ""
    }
  WHERE LeadId = ${LeadId};
`;

  // Update GarageDetails
  const updateGarageDetails = `
    UPDATE GarageDetails
    SET
    GarageNameAndAddress = ${
      GarageNameAndAddress ? `${GarageNameAndAddress}` : ""
    },
    GarageContactNo1 = ${GarageContactNo1 ? `${GarageContactNo1}` : ""},
    AddedBy = ${GarageAddedBy ? `${GarageAddedBy}` : ""},
    GarageMailAddress=${GarageMailAddress ? `${GarageMailAddress}` : ""}
    WHERE LeadId = ${LeadId};
  `;

  // Update InsuredDetails
  const updateInsuredDetails = `
    UPDATE InsuredDetails
    SET
    InsuredName = ${InsuredName ? `${InsuredName}` : ""},
    InsuredMobileNo1 = ${InsuredMobileNo1 ? `${InsuredMobileNo1}` : ""},
    InsuredMobileNo2 = ${InsuredMobileNo2 ? `${InsuredMobileNo2}` : ""},
    InsuredMailAddress = '${InsuredMailAddress}'
    WHERE LeadId = ${LeadId};
  `;

  db.query(updateClaimDetails, (error, results) => {
    if (error) {
      console.error("Error updating data in ClaimDetails:", error);
      return res
        .status(500)
        .json({ error: "Error updating data in ClaimDetails." });
    }

    db.query(updateDriverDetails, (error, results) => {
      if (error) {
        console.error("Error updating data in ClaimDetails:", error);
        return res
          .status(500)
          .json({ error: "Error updating data in ClaimDetails." });
      }

      db.query(updateVehicleDetails, (error, results) => {
        if (error) {
          console.error("Error updating data in VehicleDetails:", error);
          return res
            .status(500)
            .json({ error: "Error updating data in VehicleDetails." });
        }

        db.query(updateGarageDetails, (error, results) => {
          if (error) {
            console.error("Error updating data in GarageDetails:", error);
            return res
              .status(500)
              .json({ error: "Error updating data in GarageDetails." });
          }

          db.query(updateInsuredDetails, (error, results) => {
            if (error) {
              console.error("Error updating data in InsuredDetails:", error);
              return res
                .status(500)
                .json({ error: "Error updating data in InsuredDetails." });
            }

            res.status(200).json({ message: "Data updated successfully." });
          });
        });
      });
    });
  });
};

const getAllClaims = (req, res) => {
  const { Region1, Region2, Region3, Region4, Region5, CalimStatus } =
    req.query;
  const sql = "CALL GetPolicyInfoByRegions(?, ?, ?, ?, ?, ?)";
  const params = [
    Region1,
    Region2 || null,
    Region3 || null,
    Region4 || null,
    Region5 || null,
    CalimStatus || null,
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(result);
  });
};

const getClaimDetails = (req, res) => {
  const { token, type, leadId } = req.body;

  const sql =
    "SELECT InsuredToken ,ImageToken , VideoToken FROM ClaimDetails WHERE LeadId =?";
  db.query(sql, [leadId], (err, result2) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const stat1 = result2[0]?.InsuredToken === token && String(type) === "1";
    const stat2 = result2[0]?.ImageToken === token && String(type) === "2";
    const stat3 = result2[0]?.VideoToken === token && String(type) === "3";

    console.log("stat1", token, result2[0]?.InsuredToken, type);
    console.log("stat2", token, result2[0]?.ImageToken, type);
    console.log("stat3", token, result2[0]?.VideoToken, type);
    if (stat1 || stat2 || stat3) {
      res.status(200).send("Successfully found!!");
    } else {
      res.status(403).send("Forbidden Access!");
    }
  });
};

const updateDriverDetails = (req, res) => {
  const {
    IssuingAuthority,
    LicenseNumber,
    LicenseType,
    DriverName,
    DriverAddedDate,
    DriverTypeOfVerification,
    FatherName,
    Gender,
    BloodGroup,
    Mobile,
    Address,
    RtoName,
    ValidUpto,
    Vov,
    Photo,
    Pht,
    DateOfBirth,
    DateOfIssue,

    LeadId,
  } = req.body;

  const formattedDateOfbirth = formatDate(DateOfBirth);
  const formattedDateOfIssue = formatDate(DateOfIssue);
  const formattedValidupto = formatDate(ValidUpto);

  const updateDriverDetails = `
    UPDATE DriverDetails
    SET
    IssuingAuthority = '${IssuingAuthority ? `${IssuingAuthority}` : ""}',
    LicenseNumber = '${LicenseNumber}',
    LicenseType = '${LicenseType}',
    DriverName = '${DriverName}',
    ValidUpto ='${formattedValidupto ? `${formattedValidupto}` : ""}',
    RtoName = '${RtoName ? `${RtoName}` : ""}',
    Address ='${Address ? `${Address}` : ""}',
    Mobile = '${Mobile ? `${Mobile}` : ""}',
    BloodGroup = '${BloodGroup ? `${BloodGroup}` : ""}',
    Gender = '${Gender ? `${Gender}` : ""}',
    FatherName = '${FatherName ? `${FatherName}` : ""}',
    DateOfBirth ='${formattedDateOfbirth ? `${formattedDateOfbirth}` : ""}',
    DateOfIssue = '${formattedDateOfIssue ? `${formattedDateOfIssue}` : ""}',
    TypeOfVerification = '${DriverTypeOfVerification}'
    WHERE LeadID = ${LeadId};
  `;

  db.query(updateDriverDetails, (error, results) => {
    if (error) {
      console.log(error);
      console.error(
        `Error updating data in ${LeadId} specific DRIVER details:`,
        error
      );
      return res
        .status(500)
        .json({
          error: `Error updating data in ${LeadId} specific DRIVER details:`,
        });
    }
    res.status(200).json({ message: "Data updated successfully." });
  });
};

const updateClaimDetails = (req, res) => {
  const {
    InsuredName,
    InsuredMailAddress,
    InsuredMobileNo1,
    InsuredMobileNo2,
    PolicyIssuingOffice,
    ClaimRegion,
    ClaimServicingOffice,
    InspectionType,
    SurveyType,
    PolicyPeriodStart,
    PolicyPeriodEnd,
    InsuranceCompanyNameAddress,
    insuredAddedBy,
    IsDriverDetailsFetched,
    IsRcDetailsFetched,
    BrokerMailAddress,
    GarageMailAddress,
    LeadId,
  } = req.body;

  const formattedPolicyEnd = PolicyPeriodEnd;
  const formattedPolicyStart = PolicyPeriodStart;
  const updateClaimDetails = `
    UPDATE ClaimDetails
    SET
    PolicyIssuingOffice = '${
      PolicyIssuingOffice ? `${PolicyIssuingOffice}` : ""
    }',
    Region = '${ClaimRegion}',
    ClaimServicingOffice = '${
      ClaimServicingOffice ? `${ClaimServicingOffice}` : ""
    }',
    InspectionType = '${InspectionType}',
    SurveyType = '${SurveyType}',
    BrokerMailAddress='${BrokerMailAddress ? BrokerMailAddress : ""}',
    PolicyPeriodStart = '${
      formattedPolicyStart ? `${formattedPolicyStart}` : ""
    }',
    PolicyPeriodEnd ='${formattedPolicyEnd ? `${formattedPolicyEnd}` : ""}',
    IsDriverDetailsFetched = ${
      IsDriverDetailsFetched ? IsDriverDetailsFetched : ""
    },
    IsRcDetailsFetched = ${IsRcDetailsFetched ? IsRcDetailsFetched : ""},
    InsuranceCompanyNameAddress = '${
      InsuranceCompanyNameAddress ? `${InsuranceCompanyNameAddress}` : ""
    }'
    WHERE LeadId = ${LeadId};
  `;

  const updateInsuredDetails = `
    UPDATE InsuredDetails
    SET
    InsuredName = '${InsuredName ? `${InsuredName}` : ""}',
    InsuredMobileNo1 = '${InsuredMobileNo1 ? `${InsuredMobileNo1}` : ""}',
    InsuredMobileNo2 = '${InsuredMobileNo2 ? `${InsuredMobileNo2}` : ""}',
    InsuredMailAddress = '${InsuredMailAddress ? InsuredMailAddress : ""}'
    WHERE LeadId = ${LeadId};
  `;

  const updateGarageDetails = `
    UPDATE GarageDetails
    SET
    GarageMailAddress = '${GarageMailAddress ? `${GarageMailAddress}` : ""}'
    WHERE LeadId = ${LeadId};
  `;

  db.query(updateClaimDetails, (error, results) => {
    if (error) {
      console.error(
        `Error updating data in ${LeadId} specific CLAIM details:`,
        error
      );
      return res
        .status(500)
        .json({
          error: `Error updating data in ${LeadId} specific CLAIM details:`,
        });
    }
    db.query(updateGarageDetails, (error, results) => {
      if (error) {
        console.error(
          `Error updating data in ${LeadId} specific CLAIM details:`,
          error
        );
        return res
          .status(500)
          .json({
            error: `Error updating data in ${LeadId} specific CLAIM details:`,
          });
      }
    });
    db.query(updateInsuredDetails, (error, results) => {
      if (error) {
        console.error(
          `Error updating data in ${LeadId} specific INSURED details:`,
          error
        );
        return res
          .status(500)
          .json({
            error: `Error updating data in ${LeadId} specific INSURED details:`,
          });
      }
      res.status(200).json({ message: "Data updated successfully." });
    });
  });
};

const updateVehicleDetails = (req, res) => {
  const {
    VehicleMakeVariantModelColor,
    VehicleTypeOfBody,
    VehicleRegisteredNumber,
    CubicCapacity,
    VehicleDateOfRegistration,
    VehiclePucNumber,
    VehicleRegisteredOwner,
    VehicleTransferDate,
    VehicleEngineNumber,
    VehicleAddedBy,
    VehicleChassisNumber,
    VehicleFuelType,
    MakerDesc,
    MakerModel,
    VehicleCubicCap,
    FitUpto,
    PasiaModelCode,
    RcInsuranceUpto,
    RcVehicleType,
    BancsModelCode,
    BancsMakeCode,
    BancsSubtypeCode,
    BancsBodyType,
    BancsVehicleClass,
    BancsVehicleSegment,
    RcRtoCode,
    VehicleRcStatus,
    VehicleBlackListStatus,
    VehicleRegistedAt,
    VehicleInsuranceCompany,
    ManufactureMonthYear,
    PermanentAddress,
    ClassOfVehicle,
    SeatingCapacity,
    LeadId,
  } = req.body;

  const formattedDateOfRegistration = formatDate(VehicleDateOfRegistration);
  const formattedTransferDate = formatDate(VehicleTransferDate);
  const formattedFitUpto = formatDate(FitUpto);
  const formattedInsuranceUpto = formatDate(RcInsuranceUpto);
  const formattedMonthYear = formatDate(ManufactureMonthYear);
  // Update VehicleDetails
  const updateVehicleDetails = `
   UPDATE VehicleDetails
   SET 
     RegisteredNumber = '${
       VehicleRegisteredNumber ? `${VehicleRegisteredNumber}` : ""
     }',
     MakeVariantModelColor ='${VehicleMakeVariantModelColor}',
     TypeOfBody = '${VehicleTypeOfBody ? `${VehicleTypeOfBody}` : ""}',
     DateOfRegistration = '${
       formattedDateOfRegistration ? `${formattedDateOfRegistration}` : ""
     }',
     TransferDate = '${
       formattedTransferDate ? `${formattedTransferDate}` : ""
     }',
     EngineNumber = '${VehicleEngineNumber ? `${VehicleEngineNumber}` : ""}',
     AddedBy = '${VehicleAddedBy}',
     ChassisNumber = '${VehicleChassisNumber ? `${VehicleChassisNumber}` : ""}',
     FuelType = '${VehicleFuelType ? `${VehicleFuelType}` : ""}',
     MakerDesc = '${MakerDesc ? `${MakerDesc}` : ""}',
     MakerModel = '${MakerModel ? `${MakerModel}` : ""}',
     CubicCapacity = '${parseInt(CubicCapacity)}',
     FitUpto = '${formattedFitUpto ? `${formattedFitUpto}` : ""}',
     PasiaModelCode = '${PasiaModelCode ? `${PasiaModelCode}` : ""}',
     VehicleType =' ${RcVehicleType ? `${RcVehicleType}` : ""}',
     BancsModelCode = '${BancsModelCode ? `${BancsModelCode}` : ""}',
     BancsMakeCode = '${BancsMakeCode ? `${BancsMakeCode}` : ""}',
     BancsSubtypeCode = '${BancsSubtypeCode ? `${BancsSubtypeCode}` : ""}',
     BancsBodyType = '${BancsBodyType ? `${BancsBodyType}` : ""}',
     BancsVehicleClass = '${BancsVehicleClass ? `${BancsVehicleClass}` : ""}',
     BancsVehicleSegment = '${
       BancsVehicleSegment ? `${BancsVehicleSegment}` : ""
     }',
     RcRtoCode = '${RcRtoCode ? `${RcRtoCode}` : ""}',
     VehicleRcStatus = '${VehicleRcStatus ? `${VehicleRcStatus}` : ""}',
     VehicleBlackListStatus = '${
       VehicleBlackListStatus ? `${VehicleBlackListStatus}` : ""
     }',
     VehicleRegistedAt = '${VehicleRegistedAt ? `${VehicleRegistedAt}` : ""}',
     VehicleInsuranceCompany = '${
       VehicleInsuranceCompany ? `${VehicleInsuranceCompany}` : ""
     }',
     ManufactureMonthYear = '${
       formattedMonthYear ? `${formattedMonthYear}` : ""
     }',
     PermanentAddress = '${PermanentAddress ? `${PermanentAddress}` : ""}',
     ClassOfVehicle = '${ClassOfVehicle ? `${ClassOfVehicle}` : ""}',
     RegisteredOwner = '${
       VehicleRegisteredOwner ? `${VehicleRegisteredOwner}` : ""
     }',
     SeatingCapacity = '${SeatingCapacity ? `${SeatingCapacity}` : ""}',
     VehicleInsuranceUpto = '${
       formattedInsuranceUpto ? `${formattedInsuranceUpto}` : ""
     }'
   WHERE LeadId = ${LeadId};
 `;

  console.log(updateVehicleDetails);
  db.query(updateVehicleDetails, (error, results) => {
    if (error) {
      console.log(error);
      console.error(
        `Error updating data in ${LeadId} specific VEHICLE details:`,
        error
      );
      return res.status(500).json({ error: error });
    }
    res.status(200).json({ message: "Data updated successfully." });
  });
};

const accidentdetails = (req, res) => {
  const {
    PlaceOfLoss,
    PlaceOfSurvey,
    DateOfAccident,
    TimeOfAccident,
    Pin,
    LeadId,
  } = req.body;

  const updateAccidentDetails = `
      UPDATE AccidentDetails
      SET
      PlaceOfLoss = '${PlaceOfLoss}',
      Pin='${Pin}',
      PlaceOfSurvey='${PlaceOfSurvey}',
      DateOfAccident='${DateOfAccident}',
      TimeOfAccident='${TimeOfAccident}'
      WHERE LeadID = ${LeadId};
    `;

  db.query(updateAccidentDetails, (err, result2) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.status(200).send("Successfully Updated!!");
  });
};

const garageDetails = (req, res) => {
  const {
    GarageNameAndAddress,
    GarageAddedBy,
    GarageContactNo1,
    GarageContactNo2,
    GarageMailAddress,
    LeadId,
  } = req.body;

  const updateGarageDetails = `
    UPDATE GarageDetails
    SET
    GarageNameAndAddress = '${
      GarageNameAndAddress ? `${GarageNameAndAddress}` : ""
    }',
    GarageContactNo1 =' ${GarageContactNo1 ? `${GarageContactNo1}` : ""}',
    GarageContactNo2 = '${GarageContactNo2 ? `${GarageContactNo2}` : ""}',
    AddedBy = '${GarageAddedBy ? `${GarageAddedBy}` : ""}'
    WHERE LeadId = '${LeadId}';
  `;

  db.query(updateGarageDetails, (error, results) => {
    if (error) {
      console.error(
        `Error updating data in ${LeadId} specific GARAGE details:`,
        error
      );
      return res
        .status(500)
        .json({
          error: `Error updating data in ${LeadId} specific GARAG details:`,
        });
    }
    res.status(200).json({ message: "Data updated successfully." });
  });
};

module.exports = {
  addClaim,
  getSpecificClaim,
  updateClaim,
  getAllClaims,
  getClaimDetails,
  updateClaimDetails,
  updateDriverDetails,
  updateVehicleDetails,
  garageDetails,
  accidentdetails,
};
