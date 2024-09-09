const db = require("../Config/dbConfig");
const axios = require("axios");
const convertObjectToString = require("../Config/getObjectToString");
const { formatDate } = require("../Config/getFormattedDate");
const { breakString } = require("../Config/splitBase");

const getSpecificDriverDetails = async (req, res) => {
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
    const driverDetails = await executeQuery(
      "SELECT * FROM DriverDetails WHERE LeadId=?",
      [leadId]
    );

    const combinedResult = {
      driverDetails,
    };

    res.json(combinedResult);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

function arrayToCSV(array) {
  return array.join(',') + '';
}

const getOnlineDriverDetails = (req, res) => {
  const dl_number = req.query.dl_number;
  const dob = req.query.dob;
  const leadId = req.query.leadId;

  const payload = {
    id_number: dl_number,
    dob: dob,
  };

  axios
    .post(
      "https://kyc-api.surepass.io/api/v1/driving-license/driving-license",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.SUREPASS_AUTHORIZATION_TOKEN}`,
        },
      }
    )
    .then((result) => {
      
      const details = result?.data?.data;
      const formattedDateOfbirth = formatDate(details?.dob);
      const formattedDateOfIssue = formatDate(details?.doi);
      const formattedValidupto = formatDate(details?.doe);

      const formattedPhoto = (details?.profile_image);
      const formattedSign = breakString(details?.sign);

      const updatedLicenseType = arrayToCSV(details?.vehicle_classes);

      const stringformat = convertObjectToString(details);

      console.log("-------------------------------------");
      console.log("****************SUCCESS***************");
      console.log(`Online Api Response forDL.. DOB : ${dob} & DL Number : ${dl_number} 
      for LeadID : ${leadId} on ${new Date()}------------------------`);
      console.log(details);
      console.log("-------------------------------------------------");

      if (!details) {
        return res.status(500).send("Internal Server Error");
      }

      const insertDriverDetails = `
    INSERT INTO DriverDetailsOnline (
      LicenseNumber,
      DriverName,  
      Photo,     
      ValidUpto,      
      ValidFrom,     
      Address,         
      IssuingAuthority, 
      BloodGroup,     
      Gender,         
      FatherName,    
      DateOfBirth,   
      DateOfIssue,  
      ApiResponse,
      TypeOfVerification,
      DLStatus, 
      Remark,
      LicenseType,    
      LeadID
  )
  VALUES (
      '${details?.license_number}',
      '${details?.name}',
      '${formattedPhoto}',
      '${formattedValidupto}',
      '${formattedDateOfIssue}',
      '${details?.permanent_address},${details?.state}-${details?.permanent_zip}',
      '${details?.ola_name} , ${details?.ola_code}',
      '${details?.blood_group}',
      '${details?.gender}',
      '${details?.father_or_husband_name}',
      '${formattedDateOfbirth}',
     '${formattedDateOfIssue}',
      '${stringformat}',
      "Online",
      '${details?.current_status}',
      '${"Verified from Online"}',
      '${updatedLicenseType}',
      '${leadId}'
  );
    `;

      const updateDriverQuery = `
    UPDATE DriverDetails
SET
    LicenseNumber = '${details?.license_number}',
    DriverName = '${details?.name}',
    Photo = '${formattedPhoto}',
    ValidUpto = '${formattedValidupto}',
    ValidFrom = '${formattedDateOfIssue}',
    Address = '${details?.permanent_address},${details?.state}-${details?.permanent_zip}',
    IssuingAuthority = '${details?.ola_name} , ${details?.ola_code}',
    BloodGroup = '${details?.blood_group}',
    Gender = '${details?.gender}',
    FatherName = '${details?.father_or_husband_name}',
    DateOfBirth = '${formattedDateOfbirth}',
    DateOfIssue = '${formattedDateOfIssue}',
    TypeOfVerification = 'Online',
    DLStatus = '${details?.current_status}',
    LicenseType = '${updatedLicenseType}',
    Remark='${"Verified from Online"}'
WHERE
    LeadID = ${leadId};`;


    console.log("queries",insertDriverDetails,updateDriverQuery);

      db.query(
        "DELETE FROM DriverDetailsOnline WHERE LeadID=?",
        [leadId],
        (error, results) => {
          if (error) {
            console.error("Error updating data in driver Details:", error);
            return res
              .status(500)
              .json({ error: "Error updating data in driver Details." });
          }

          db.query(insertDriverDetails, (error, results) => {
            if (error) {
              console.log(error);
              return res
                .status(500)
                .json({ error: "Error updating data in driver Details." });
            }
            db.query(updateDriverQuery, (error, results) => {
              if (error) {
                console.log(error);
                return res
                  .status(500)
                  .json({ error: "Error updating data in driver Details." });
              }
              res.status(200).json({ message: "Data updated successfully." });
            });
          });
        }
      );
    })
    .catch((Err) => {
      console.log("-------------------------------------");
      console.log("*************ERROR**********************");
      console.log(` Got error while fetching the online DL Details for DOB : ${dob} & DL no. ${dl_number}
      for LeadID : ${leadId} on ${new Date()}------------`);
      console.log(Err.response.data);
      console.log("-------------------------------------");
      return res.status(500).send("Record Not Found!");
    });
};

module.exports = {
  getOnlineDriverDetails,
  getSpecificDriverDetails,
};
