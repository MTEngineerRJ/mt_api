
const db = require("../Config/dbConfig");
const { formatDate } = require("../Config/getFormattedDate");

const updateFinalReport = (req,res)=>{

  
    const {
      PolicyType ,
      TypeOfDate,
      IDV  ,
      PolicyPeriodStart,
      PolicyPeriodEnd ,
      HPA ,
      ClaimServicingOffice,
      OwnerSRST,
      VehicleMakeVariantModelColor,
      DateOfIssue,
      MailRecieveDate,
      ValidFrom,
      VehicleType,
      ValidUntilNtv,
      ValidUntilTv,
      phoneNumber,
      AntiTheft,
      RegLadenWt,
      RemarkIfRLW,
      Pin,
      DateOfRegistration,
      PlaceOfSurvey,
      UnladenWT,
      RemarkIfULW,
      VehicleRemark,
      InsuranceCompanyNameAddress,
      InsuredAddress,InsuredMailAddress,
      InsuredMobileNo1,
      InsuredMobileNo2,
      InsuredName,
      requestType,
      ClaimNumber,
      EngineType,
      DateRegistration,
      PUCNumber,
      TransferDate,
      AddedBy,
      Verification,
      GarageAddedBy,
      InspectionDate,
      GarageContactNo1,
      GarageContactNo2,
      GarageNameAndAddress,
      ClaimAddedDateTime,
      PolicyIssuingOffice,
      PolicyNumber,
      DriverName,
      DriverAddedDate,
      IssuingAuthority,
      LicenseNumber,
      LicenseType,
      BadgeNumber,
      driverRemark,
      VehicleRegisteredNumber,
      RegisteredOwner,
      VehicleChassisNumber,
      EngineNumber,
      VehicleTypeOfBody,
      VehicleCubicCapacity,
      VehicleClassOfVehicle,
      VehicleFuelType,
      VehicleOdometerReading,
      VehiclePreAccidentCondition,
      VehicleModel,
      VehicleTaxParticulars,
      VehicleSeatingCapacity,
      AccidentAddedDateTime,
      AccidentTime,
      PlaceOfLoss,
      SurveyAllotmentDate,
      SurveyConductedDate,
      FitnessCertificate,
      FitnessFrom,
      FitnessTo,
      PermitTo,
      PermitNo,
      PermitFrom,
      TypeOfPermit,
      Authorization,
      AreasOfoperation,
      commercialRemark,
      FinalReportNotes,
      DetailsOfLoads,
      CauseOfAccident,
      PoliceAction,
      ThirdPartyLoss,
      Assessment,
      leadId,
      TotalLabor,
      TotalEstimate,
      LessExcess,
      ExpectedSalvage,
      MetalPercent,
      RemarkOnSalvage,
      TotalCostOfParts,
      Other,
      GrandTotal,
      DepreciationOnParts,
      NetAssessedAmount,
      SavageDepreciationDetails,
      CashLess,
      NoteOfSelf,
      RepairAutoDate,
      RepairCompletionDate,
      PartyAgreed,
      ReasonThereofDelay,
      AnyFurtherConversation,
      RepairingPhotoDate,
      ReinspectionDate,
      isActive,
      SalveDestroy,
      BillNo,
      BillDate,
      BillAmount,
      AddedDateTime,
      Endurance,
      OtherRemark,
      TotalLoss,
      DateOfBirth,
      IMT,
      ValidUpto
    } = req.body;

    //Claim Dates
    const formattedPolicyEnd = formatDate(PolicyPeriodEnd)
    const formattedPolicyStart = formatDate(PolicyPeriodStart)
    const formattedMailRecevingDate = formatDate(MailRecieveDate);
    const formattedClaimAddedDate = formatDate(AddedDateTime);

    //Vehicle Dates
    const formattedDateOfRegistration = formatDate(DateOfRegistration);
    const formattedTransferDate = formatDate(TransferDate);
    const formattedTaxParticulars = formatDate(VehicleTaxParticulars)

    //Driver Dates
    const formattedDateOfbirth = formatDate(DateOfBirth)
    const formattedDateOfIssue = formatDate(DateOfIssue)
    const formattedValidUntilNtv = formatDate(ValidUntilNtv)
    const formattedValidUntilTv = formatDate(ValidUntilTv)
    const formattedValidupto = formatDate(ValidUpto)
    const formattedDriverAddedDate = formatDate(DriverAddedDate)


    //Accident Dates
    const formattedDateOfAccident = formatDate(AccidentAddedDateTime)
    const formattedSurveyConductedDate = formatDate(SurveyConductedDate);
    const formattedInspectionDate = formatDate(InspectionDate);

    //Commercial Vehicle Details
    const formattedFitnessFrom = formatDate(FitnessFrom);
    const formattedFittnessTo = formatDate(FitnessTo);
    const formattedPermitTo = formatDate(PermitTo);
    const formattedPermitFrom = formatDate(PermitFrom);

    //summary Dates
    const formattedRepairAutoDate = formatDate(RepairAutoDate);
    const formattedRepairCompletionDate = formatDate(RepairCompletionDate);
    const formattedReparingPhotoDate = formatDate(RepairingPhotoDate);
    const formattedReInspectionDate = formatDate(ReinspectionDate);
    const formattedBillDate = formatDate(BillDate);

    const updateDriverDetails = `
    UPDATE DriverDetails
    SET
    AddedDate = '${formattedDriverAddedDate}' ,
    DriverName = '${DriverName}',
    LicenseNumber='${LicenseNumber}',
    LicenseType='${LicenseType}',
    IssuingAuthority = '${IssuingAuthority}',
    DateOfIssue = '${formattedDateOfIssue}',
    ValidFrom='${ValidFrom}',
    ValidUntilNtv = '${formattedValidUntilNtv}',
    ValidUntilTv = '${formattedValidUntilTv}',
    BadgeNumber='${BadgeNumber}',
    Remark='${driverRemark}',
    DateOfBirth='${formattedDateOfbirth}',
    ValidUpto='${formattedValidupto}'
    WHERE LeadID = ${leadId};
  `;

  // Update ClaimDetails query with CASE statement
  const updateClaimDetails = `
    UPDATE ClaimDetails
    SET
    InsuranceCompanyNameAddress = '${InsuranceCompanyNameAddress}',
    SurveyType = '${""}',
    PolicyIssuingOffice='${PolicyIssuingOffice}',
    PolicyNumber = '${PolicyNumber}',
    PolicyPeriodStart='${formattedPolicyStart}',
    PolicyPeriodEnd='${ formattedPolicyEnd}' ,
    ClaimNumber = '${ClaimNumber}',
    ClaimServicingOffice='${ClaimServicingOffice}',
    InspectionType = '${""}',
    PolicyType='${PolicyType}',
    IDV='${IDV}',
    MailRecieveDate='${formattedMailRecevingDate}',
    HPA='${HPA}',
    TotalLoss = ${(TotalLoss) ? 1 : 0},
    IMT = ${(IMT) ? 1 : 0}
    WHERE LeadID = ${leadId};
  `;

 

  // Update VehicleDetails query with CASE statement
   
  const updateVehicleDetails = `
    UPDATE VehicleDetails
    SET
    TypeOfVerification = '${Verification}',
    RegisteredNumber = '${VehicleRegisteredNumber}',
    RegisteredOwner='${RegisteredOwner}',
    TransferDate = '${formattedTransferDate}',
    DateOfRegistration = '${formattedDateOfRegistration}',
    MakeVariantModelColor = '${VehicleMakeVariantModelColor}',
    EngineNumber='${EngineNumber}',
    ChassisNumber = '${VehicleChassisNumber}',
    TypeOfBody = '${VehicleTypeOfBody}',
    ClassOfVehicle = '${VehicleClassOfVehicle}',
    PreAccidentCondition='${VehiclePreAccidentCondition}',
    SeatingCapacity = '${VehicleSeatingCapacity}',
    CubicCapacity = '${VehicleCubicCapacity}',
    FuelType = '${VehicleFuelType}',
    TaxParticulars='${formattedTaxParticulars}',
    OdometerReading = '${VehicleOdometerReading}',
    PucNumber='${PUCNumber}',
    OwnerSrDate='${OwnerSRST}',
    RegLadenWt='${(RegLadenWt)}',
    RemarkIfRLW='${RemarkIfRLW}',
    UnladenWT='${(UnladenWT)}',
    RemarkIfULW='${RemarkIfULW}',
    Remark='${VehicleRemark}',
    VehicleType='${VehicleType}',
    AntiTheft='${AntiTheft}'
    WHERE LeadID = ${leadId};
  `;

  // Update GarageDetails query with CASE statement
  const updateGarageDetails = `
    UPDATE GarageDetails
    SET
    GarageNameAndAddress = '${GarageNameAndAddress}',
    GarageContactNo1 = '${GarageContactNo1}',
    AddedBy='${GarageAddedBy}'
    WHERE LeadID = ${leadId};
  `;

  // Update InsuredDetails query with CASE statement
  const updateInsuredDetails = `
    UPDATE InsuredDetails
    SET
    InsuredName = '${InsuredName}',
    InsuredMobileNo1 = '${InsuredMobileNo1}',
    InsuredMobileNo2='${InsuredMobileNo2}',
    InsuredMailAddress = '${InsuredMailAddress}',
    InsuredAddress = '${InsuredAddress}'
    WHERE LeadID = ${leadId};
  `;

  // Update AccidentDetails query with CASE statement
  const updateAccidentDetails = `
    UPDATE AccidentDetails
    SET
    PlaceOfLoss = '${PlaceOfLoss}',
    SurveyConductedDate ='${formattedSurveyConductedDate}',
    Pin='${Pin}',
    InspectionDate='${formattedInspectionDate}',
    PlaceOfSurvey='${PlaceOfSurvey}',
    DetailsOfLoads='${DetailsOfLoads}',
    CauseOfAccident='${CauseOfAccident}',
    PoliceAction='${PoliceAction}',
    ThirdPartyLoss='${ThirdPartyLoss}',
    Assessment='${Assessment}',
    DateOfAccident='${formattedDateOfAccident}',
    TimeOfAccident='${AccidentTime}'
    WHERE LeadID = ${leadId};
  `;

    const insertIntoCommercialVehicleDetails = `
    INSERT INTO CommercialVehicleDetails (
      FitnessCertificate,
        FitnessFrom,
        FitnessTo,
        PermitTo,
        PermitNo,
        PermitFrom,
      TypeOfPermit,
      Authorization,
      AreasOfoperation,
      Remark,
      IsActive,
      LeadID 
    ) VALUES (
      '${FitnessCertificate}',
     '${formattedFitnessFrom}',
     '${formattedFittnessTo }', 
     '${formattedPermitTo}',
      '${PermitNo}',
     '${formattedPermitFrom}',
      '${TypeOfPermit}',
      '${Authorization}',
      '${AreasOfoperation}',
      '${commercialRemark}',
      ${isActive},
      '${(leadId)}'
    );
    `;
  
    const updateCommercialVehicleDetails = `
    UPDATE CommercialVehicleDetails
          SET
          FitnessCertificate = '${FitnessCertificate}',
          FitnessFrom ='${formattedFitnessFrom}' ,
          FitnessTo='${formattedFittnessTo}',
          PermitTo='${PermitTo}',
          PermitNo='${formattedPermitTo}',
          PermitFrom='${formattedPermitFrom}',
          TypeOfPermit='${TypeOfPermit}',
          Authorization='${Authorization}',
          AreasOfoperation='${AreasOfoperation}',
          Remark='${commercialRemark}',
          IsActive = ${isActive}
          WHERE LeadID = ${leadId};
    `;

    const updateSummaryDetails = `
    UPDATE SummaryReport
          SET
          TotalLabour = '${TotalLabor}',
          TotalEstimate ='${TotalEstimate}' ,
          TotalCostOfParts='${TotalCostOfParts}',
          LessExcess='${LessExcess}',
          ExpectedSalvage='${ExpectedSalvage}',
          MetalPercent='${MetalPercent}',
          RemarkOnSalvage='${RemarkOnSalvage}',
          Other='${Other}',
          GrandTotal='${GrandTotal}',
          DepreciationOnParts='${DepreciationOnParts}',
          NetAssessedAmount='${NetAssessedAmount}',
          SavageDepreciationDetails='${SavageDepreciationDetails}',
          CashLess=${CashLess?1:0},
          NoteOfSelf='${NoteOfSelf}',
          RepairAutoDate='${formattedRepairAutoDate}',
          RepairCompletionDate='${formattedRepairCompletionDate}',
          PartyAgreed='${PartyAgreed}', 
          ReasonThereofDelay='${ReasonThereofDelay}',
          AnyFurtherConversation='${AnyFurtherConversation}',
          RepairingPhotoDate='${formattedReparingPhotoDate}',
          ReinspectionDate='${formattedReInspectionDate}',
          SalveDestroy='${SalveDestroy}',
          BillNo='${BillNo}',
          BillDate='${formattedBillDate}',
          BillAmount='${BillAmount}',
          Endurance='${Endurance}',
          OtherRemark='${OtherRemark}',
          SummaryNotes='${FinalReportNotes.replace(/'/g, "''").replace(/\n/g, '<br>')}'
          WHERE LeadId = ${leadId};
    `;
  
    const insertSummaryDetails = `
      INSERT INTO SummaryReport (
        LeadId, TotalLabour, TotalEstimate, TotalCostOfParts, LessExcess, ExpectedSalvage, MetalPercent, RemarkOnSalvage,
       Other, GrandTotal, DepreciationOnParts, NetAssessedAmount, SavageDepreciationDetails, CashLess,
        NoteOfSelf, RepairAutoDate, RepairCompletionDate, PartyAgreed, ReasonThereofDelay, AnyFurtherConversation,
        RepairingPhotoDate, ReinspectionDate, SalveDestroy, BillNo, BillDate, BillAmount, Endurance,OtherRemark,SummaryNotes
      ) VALUES (
        ${leadId}, ${TotalLabor}, ${TotalEstimate}, ${TotalCostOfParts}, '${LessExcess}', '${ExpectedSalvage}', ${MetalPercent},
        '${RemarkOnSalvage}', '${Other}', ${GrandTotal}, ${DepreciationOnParts}, ${NetAssessedAmount},
        '${SavageDepreciationDetails}', '${CashLess}', '${NoteOfSelf}', '${formattedRepairAutoDate}', '${formattedRepairCompletionDate}',
        '${PartyAgreed}', '${ReasonThereofDelay}', '${AnyFurtherConversation}', '${formattedReparingPhotoDate}', '${formattedReInspectionDate}',
        '${SalveDestroy}', '${BillNo}', '${formattedBillDate}', '${BillAmount}', '${Endurance}','${OtherRemark}','${FinalReportNotes}'
      );
    `;

    // const updateTotalLossDetails = `
    // UPDATE TotalLoss
    //       SET
    //       CommTaxRatePct = ${CommTaxRatePct},
    //       CashLoss =${CashLoss},
    //       SuspectedParts='${SuspectedParts}',
    //       WreckValueWith=${WreckValueWith},
    //       WreckValueWithout=${WreckValueWithout},
    //       RtiAmount=${RtiAmount},
    //       MissingItem='${MissingItem}',
    //       totalLossEditorContent='${TotalLossEditor}'
    //       WHERE LeadID = ${leadId};
    // `;
  
    // const InsertTotalLossDetails = `
    //   INSERT INTO TotalLoss (
    //     LeadID, CommTaxRatePct,CashLoss,SuspectedParts, WreckValueWith, WreckValueWithout, RtiAmount, MissingItem,totalLossEditorContent
    //   ) VALUES (
    //     ${leadId},${CommTaxRatePct},${CashLoss}, '${SuspectedParts}', ${WreckValueWith}, ${WreckValueWithout}, ${RtiAmount},'${MissingItem}',${TotalLossEditor}
    //   );
    // `;

    // db.query("SELECT * FROM TotalLoss WHERE LeadID=?",[leadId], (err, result2) => {
    //   if (err) {
    //     console.error(err);
    //     res.status(500).send("Internal Server Error",err);
    //     return;
    //   }
     
    //     const query = result2?.length ? updateTotalLossDetails : InsertTotalLossDetails;
    //     console.log(query);
        
    //   db.query(query, (err, result2) => {
    //     if (err) {
    //       console.error(err);
    //       res.status(500).send("Internal Server Error",err);
    //       return;
    //     }
        
    //   });
    
    // });


    db.query(updateClaimDetails, (err, result2) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error",err);
        return;
      }
  });

  db.query(updateAccidentDetails, (err, result2) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error",err);
      return;
    }
   
  });
    db.query(updateDriverDetails, (err, result2) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error",err);
        return;
      }
     
    });
    db.query(updateGarageDetails, (err, result2) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error",err);
        return;
      }
     
    });
  
    db.query(updateInsuredDetails, (err, result2) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error",err);
        return;
      }
     
    });
    db.query(updateVehicleDetails, (err, result2) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error",err);
        return;
      }
     
    });

   
  
    db.query("SELECT * FROM SummaryReport WHERE LeadId=?",[leadId], (err, result2) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error",err);
        return;
      }
     
        const query = result2?.length ? updateSummaryDetails : insertSummaryDetails;
        
        
      db.query(query, (err, result2) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error",err);
          return;
        }
        
      });
    
    });


    db.query("SELECT * FROM CommercialVehicleDetails WHERE LeadID=?",[leadId], (err, result2) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error",err);
        return;
      }
     
        const query = result2?.length ? updateCommercialVehicleDetails : insertIntoCommercialVehicleDetails;
        
      db.query(query, (err, result2) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error",err);
          return;
        }
        
      });
    
    });
  

  


  
    res.status(200).send("Successfully Updated!!");

  };

  const updatePolicyReport = (req,res)=>{

    console.log("Updating final report", req.body);
      const {
        PolicyType ,
        TypeOfDate,
        IDV  ,
        PolicyPeriodStart,
        PolicyPeriodEnd ,
        HPA ,
        ClaimServicingOffice,
        OwnerSRST,
        VehicleMakeVariantModelColor,
        DateOfIssue,
        MailRecieveDate,
        ValidFrom,
        VehicleType,
        ValidUntilNtv,
        ValidUntilTv,
        phoneNumber,
        AntiTheft,
        RegLadenWt,
        RemarkIfRLW,
        Pin,
        DateOfRegistration,
        PlaceOfSurvey,
        UnladenWT,
        RemarkIfULW,
        VehicleRemark,
        InsuranceCompanyNameAddress,
        InsuredAddress,InsuredMailAddress,
        InsuredMobileNo1,
        InsuredMobileNo2,
        InsuredName,
        requestType,
        ClaimNumber,
        EngineType,
        DateRegistration,
        PUCNumber,
        TransferDate,
        AddedBy,
        Verification,
        GarageAddedBy,
        InspectionDate,
        GarageContactNo1,
        GarageContactNo2,
        GarageNameAndAddress,
        ClaimAddedDateTime,
        PolicyIssuingOffice,
        PolicyNumber,
        DriverName,
        DriverAddedDate,
        IssuingAuthority,
        LicenseNumber,
        LicenseType,
        BadgeNumber,
        driverRemark,
        VehicleRegisteredNumber,
        RegisteredOwner,
        VehicleChassisNumber,
        EngineNumber,
        VehicleTypeOfBody,
        VehicleCubicCapacity,
        VehicleClassOfVehicle,
        VehicleFuelType,
        VehicleOdometerReading,
        VehiclePreAccidentCondition,
        VehicleModel,
        VehicleTaxParticulars,
        VehicleSeatingCapacity,
        AccidentAddedDateTime,
        AccidentTime,
        PlaceOfLoss,
        SurveyAllotmentDate,
        SurveyConductedDate,
    
        FitnessCertificate,
        FitnessFrom,
        FitnessTo,
        PermitTo,
        PermitNo,
        PermitFrom,
        TypeOfPermit,
        Authorization,
        AreasOfoperation,
        commercialRemark,
        FinalReportNotes,
    
        DetailsOfLoads,
        CauseOfAccident,
        PoliceAction,
        ThirdPartyLoss,
        Assessment,
        leadId,
  
        TotalLabor,
        TotalEstimate,
        LessExcess,
        ExpectedSalvage,
        MetalPercent,
        RemarkOnSalvage,
        TotalCostOfParts,
        AccidentInspectionDate,
        Other,
        GrandTotal,
        DepreciationOnParts,
        NetAssessedAmount,
        SavageDepreciationDetails,
        CashLess,
        NoteOfSelf,
        RepairAutoDate,
        RepairCompletionDate,
        PartyAgreed,
        ReasonThereofDelay,
        AnyFurtherConversation,
        RepairingPhotoDate,
        ReinspectionDate,
      
        SalveDestroy,
        BillNo,
        BillDate,
        BillAmount,
        setVehicleUpto,
        AddedDateTime,
        Endurance,
        OtherRemark,
        TotalLoss,
        DateOfBirth,
        IMT,
        ValidUpto,
        phyCheck
      } = req.body;
  
      const updateDriverDetails = `
      UPDATE DriverDetails
      SET
      AddedDate = '${DriverAddedDate}' ,
      DriverName = '${DriverName}',
      LicenseNumber='${LicenseNumber}',
      LicenseType='${LicenseType}',
      IssuingAuthority = '${IssuingAuthority}',
      DateOfIssue = '${DateOfIssue}',
      ValidFrom='${ValidFrom}',
      ValidUntilNtv = '${ValidUntilNtv}',
      ValidUntilTv = '${ValidUntilTv}',
      BadgeNumber='${BadgeNumber}',
      Remark='${driverRemark}',
      DateOfBirth='${DateOfBirth}',
      ValidUpto='${ValidUpto}'
      WHERE LeadID = ${leadId};
    `;
  
    // Update ClaimDetails query with CASE statement
    const updateClaimDetails = `
      UPDATE ClaimDetails
      SET
      InsuranceCompanyNameAddress = '${InsuranceCompanyNameAddress}',
      SurveyType = '${""}',
      PolicyIssuingOffice='${PolicyIssuingOffice}',
      PolicyNumber = '${PolicyNumber}',
      PolicyPeriodStart='${PolicyPeriodStart}',
      PolicyPeriodEnd='${ PolicyPeriodEnd}' ,
      ClaimNumber = '${ClaimNumber}',
      ClaimServicingOffice='${ClaimServicingOffice}',
      InspectionType = '${""}',
      PolicyType='${PolicyType}',
      IDV='${IDV}',
      MailRecieveDate='${MailRecieveDate}',
      HPA='${HPA}',
      TotalLoss = ${(TotalLoss) ? 1 : 0},
      IMT = ${(IMT) ? 1 : 0}
      WHERE LeadID = ${leadId};
    `;
  
   
  
    // Update VehicleDetails query with CASE statement
     
    const updateVehicleDetails = `
      UPDATE VehicleDetails
      SET
      TypeOfVerification = '${Verification}',
      RegisteredNumber = '${VehicleRegisteredNumber}',
      RegisteredOwner='${RegisteredOwner}',
      TransferDate = '${TransferDate}',
      DateOfRegistration = '${DateRegistration}',
      MakeVariantModelColor = '${VehicleMakeVariantModelColor}',
      EngineNumber='${EngineNumber}',
      ChassisNumber = '${VehicleChassisNumber}',
      TypeOfBody = '${VehicleTypeOfBody}',
      ClassOfVehicle = '${VehicleClassOfVehicle}',
      PreAccidentCondition='${VehiclePreAccidentCondition}',
      SeatingCapacity = '${VehicleSeatingCapacity}',
      CubicCapacity = '${VehicleCubicCapacity}',
      FuelType = '${VehicleFuelType}',
      TaxParticulars='${VehicleTaxParticulars}',
      OdometerReading = '${VehicleOdometerReading}',
      PucNumber='${PUCNumber}',
      OwnerSrDate='${OwnerSRST}',
      RegLadenWt='${(RegLadenWt)}',
      RemarkIfRLW='${RemarkIfRLW}',
      UnladenWT='${(UnladenWT)}',
      RemarkIfULW='${RemarkIfULW}',
      Remark='${VehicleRemark}',
      VehicleType='${VehicleType}',
      AntiTheft='${AntiTheft}'
      WHERE LeadID = ${leadId};
    `;
  
    // Update GarageDetails query with CASE statement
    const updateGarageDetails = `
      UPDATE GarageDetails
      SET
      GarageNameAndAddress = '${GarageNameAndAddress}',
      GarageContactNo1 = '${GarageContactNo1}',
      AddedBy='${GarageAddedBy}'
      WHERE LeadID = ${leadId};
    `;
  
    // Update InsuredDetails query with CASE statement
    const updateInsuredDetails = `
      UPDATE InsuredDetails
      SET
      InsuredName = '${InsuredName}',
      InsuredMobileNo1 = '${InsuredMobileNo1}',
      InsuredMobileNo2='${InsuredMobileNo2}',
      InsuredMailAddress = '${InsuredMailAddress}',
      InsuredAddress = '${InsuredAddress}'
      WHERE LeadID = ${leadId};
    `;
  
    // Update AccidentDetails query with CASE statement
    const updateAccidentDetails = `
      UPDATE AccidentDetails
      SET
      PlaceOfLoss = '${PlaceOfLoss}',
      SurveyConductedDate ='${SurveyConductedDate}',
      Pin='${Pin}',
      InspectionDate='${InspectionDate}',
      PlaceOfSurvey='${PlaceOfSurvey}',
      DetailsOfLoads='${DetailsOfLoads}',
      CauseOfAccident='${CauseOfAccident}',
      PoliceAction='${PoliceAction}',
      ThirdPartyLoss='${ThirdPartyLoss}',
      Assessment='${Assessment}',
      DateOfAccident='${AccidentAddedDateTime}',
      TimeOfAccident='${AccidentTime}'
      WHERE LeadID = ${leadId};
    `;
  
      const insertIntoCommercialVehicleDetails = `
      INSERT INTO CommercialVehicleDetails (
        FitnessCertificate,
          FitnessFrom,
          FitnessTo,
          PermitTo,
          PermitNo,
          PermitFrom,
        TypeOfPermit,
        Authorization,
        AreasOfoperation,
        Remark,
        LeadID 
      ) VALUES (
        '${FitnessCertificate}',
       '${FitnessFrom}',
       '${FitnessTo }', 
       '${PermitTo}',
        '${PermitNo}',
       '${PermitFrom}',
        '${TypeOfPermit}',
        '${Authorization}',
        '${AreasOfoperation}',
        '${commercialRemark}',
        '${(leadId)}'
      );
      `;
    
      const updateCommercialVehicleDetails = `
      UPDATE CommercialVehicleDetails
            SET
            FitnessCertificate = '${FitnessCertificate}',
            FitnessFrom ='${FitnessFrom}' ,
            FitnessTo='${FitnessTo}',
            PermitTo='${PermitTo}',
            PermitNo='${PermitNo}',
            PermitFrom='${PermitFrom}',
            TypeOfPermit='${TypeOfPermit}',
            Authorization='${Authorization}',
            AreasOfoperation='${AreasOfoperation}',
            Remark='${commercialRemark}'
            WHERE LeadID = ${leadId};
      `;
  
      const updateSummaryDetails = `
      UPDATE SummaryReport
            SET
            TotalLabour = '${TotalLabor}',
            TotalEstimate ='${TotalEstimate}' ,
            TotalCostOfParts='${TotalCostOfParts}',
            LessExcess='${LessExcess}',
            ExpectedSalvage='${ExpectedSalvage}',
            MetalPercent='${MetalPercent}',
            RemarkOnSalvage='${RemarkOnSalvage}',
            Other='${Other}',
            GrandTotal='${GrandTotal}',
            DepreciationOnParts='${DepreciationOnParts}',
            NetAssessedAmount='${NetAssessedAmount}',
            SavageDepreciationDetails='${SavageDepreciationDetails}',
            CashLess=${CashLess?1:0},
            NoteOfSelf='${NoteOfSelf}',
            RepairAutoDate='${RepairAutoDate}',
            RepairCompletionDate='${RepairCompletionDate}',
            PartyAgreed='${PartyAgreed}', 
            ReasonThereofDelay='${ReasonThereofDelay}',
            AnyFurtherConversation='${AnyFurtherConversation}',
            RepairingPhotoDate='${RepairingPhotoDate}',
            ReinspectionDate='${ReinspectionDate}',
            SalveDestroy='${SalveDestroy}',
            BillNo='${BillNo}',
            BillDate='${BillDate}',
            BillAmount='${BillAmount}',
            Endurance='${Endurance}',
            OtherRemark='${OtherRemark}',
            SummaryNotes='${FinalReportNotes}'
            WHERE LeadId = ${leadId};
      `;
    
      const insertSummaryDetails = `
        INSERT INTO SummaryReport (
          LeadId, TotalLabour, TotalEstimate, TotalCostOfParts, LessExcess, ExpectedSalvage, MetalPercent, RemarkOnSalvage,
         Other, GrandTotal, DepreciationOnParts, NetAssessedAmount, SavageDepreciationDetails, CashLess,
          NoteOfSelf, RepairAutoDate, RepairCompletionDate, PartyAgreed, ReasonThereofDelay, AnyFurtherConversation,
          RepairingPhotoDate, ReinspectionDate, SalveDestroy, BillNo, BillDate, BillAmount, Endurance,OtherRemark,SummaryNotes
        ) VALUES (
          ${leadId}, ${TotalLabor}, ${TotalEstimate}, ${TotalCostOfParts}, ${LessExcess}, ${ExpectedSalvage}, ${MetalPercent},
          '${RemarkOnSalvage}', '${Other}', ${GrandTotal}, ${DepreciationOnParts}, ${NetAssessedAmount},
          '${SavageDepreciationDetails}', '${CashLess}', '${NoteOfSelf}', '${RepairAutoDate}', '${RepairCompletionDate}',
          '${PartyAgreed}', '${ReasonThereofDelay}', '${AnyFurtherConversation}', '${RepairingPhotoDate}', '${ReinspectionDate}',
          '${SalveDestroy}', '${BillNo}', '${BillDate}', '${BillAmount}', '${Endurance}','${OtherRemark}','${FinalReportNotes}'
        );
      `;
  

      
      db.query(updateClaimDetails, (err, result2) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
    });
  
    db.query(updateAccidentDetails, (err, result2) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
     
    });
      db.query(updateDriverDetails, (err, result2) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
       
      });
      db.query(updateGarageDetails, (err, result2) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
       
      });
    
      db.query(updateInsuredDetails, (err, result2) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
       
      });
      db.query(updateVehicleDetails, (err, result2) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
       
      });
  
     
    
      db.query("SELECT * FROM SummaryReport WHERE LeadId=?",[leadId], (err, result2) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
       
          const query = result2?.length ? updateSummaryDetails : insertSummaryDetails;
          
          
        db.query(query, (err, result2) => {
          if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
          }
          
        });
      
      });
  
  
      db.query("SELECT * FROM CommercialVehicleDetails WHERE LeadID=?",[leadId], (err, result2) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
       
          const query = result2?.length ? updateCommercialVehicleDetails : insertIntoCommercialVehicleDetails;
          
        db.query(query, (err, result2) => {
          if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
          }
          
        });
      
      });
    
  
    
  
  
    
      res.status(200).send("Successfully Updated!!");
  
    };

  module.exports={updateFinalReport}
  
