const db = require("../Config/dbConfig");

const getDocuments = (req, res) => {
  const LeadId = req.query.LeadId;
  //const sql = "SELECT LeadID, DocumentName, Photo1 as FileUrl, Attribute1 as FileName, Photo1Latitude as Latitude, Photo1Longitude as Longitude, Photo1Timestamp as Timestamp FROM DocumentList WHERE LeadID = ?;";
  
  const sql = "SELECT DL.LeadID, DL.DocumentName, DL.Photo1 AS FileUrl, DL.Attribute1 AS FileName, DL.Photo1Latitude AS Latitude, DL.Photo1Longitude AS Longitude, DL.Photo1Timestamp AS Timestamp FROM DocumentList DL WHERE DL.LeadID=? AND EXISTS ( SELECT 1 FROM ClaimStatus CS WHERE CS.LeadID = DL.LeadID AND (CS.Status = 1 OR CS.LeadID = ?));";
  
  if (!LeadId) {
    return res.json({ status: false, data: null, message: "invalid lead id" });
  }

  db.query(sql, [LeadId,LeadId], (err, result) => {
    if (err) {
      return res.json({ status: false, data: null, message: "Internal Server Error" });
    }
    const groupedResult = {};
    result.forEach(doc => {
      const { LeadID, DocumentName, FileUrl, FileName, Latitude, Longitude, Timestamp } = doc;
      if (!groupedResult[DocumentName]) {
        groupedResult[DocumentName] = {
          LeadID,
          DocumentName,
          DocumentList: []
        };
      }
      //console.log('result',result);
      groupedResult[DocumentName].DocumentList.push({ FileUrl, FileName, Latitude, Longitude, Timestamp });
    });

    // Convert the grouped result to an array
    const processedResult = {
      status: true,
      message: "details found",
      data: Object.values(groupedResult)
    };

    res.send(processedResult);
  });
};

const uploadDocument = (req, res) => {
  const { LeadID, DocumentName, FileUrl, FileName, Latitude, Longitude, Timestamp } = req.body;

  if (!LeadID || !DocumentName) {
    return res.json({ status: false, data: null, message: "lead id can't be blank" });
  }
  const insertUploadDetails = `
      INSERT INTO DocumentList (
        LeadId,
        DocumentName,
        Photo1,
        Attribute1,
        Photo1Latitude,
        Photo1Longitude,
        Photo1Timestamp
      ) VALUES (
        '${LeadID}',
        '${DocumentName}',
        '${FileUrl}',
        '${FileName}',
        '${Latitude}',
        '${Longitude}',
        '${Timestamp}'
      );
    `;

  db.query(insertUploadDetails, (error, results) => {
    if (error) {
      return res.json({ status: false, data: null, message: "Internal Server Error" });
    } else {
      return res.json({ status: true, data: "Successfully Updated!!", message: "Successfully Updated!!" })
    }
  });

};

module.exports = {
  getDocuments,
  uploadDocument
};
