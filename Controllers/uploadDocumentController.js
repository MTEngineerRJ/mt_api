const db = require("../Config/dbConfig");

const getDocuments = (req, res) => {
  const LeadId = req.query.LeadId;
  const sql = "SELECT DocumentName, Photo1 as doc_url, Attribute1 as file_name, Photo1Latitude as latitude, Photo1Longitude as longitude, Photo1Timestamp as timestamp FROM DocumentList WHERE LeadID = ?;";

  if (!LeadId) {
    return res.json({ status: false, data: null, message: "invalid lead id" });
  }

  db.query(sql, [LeadId], (err, result) => {
    if (err) {
      return res.json({ status: false, data: null, message: "Internal Server Error" });
    }
    const groupedResult = {};
    result.forEach(doc => {
      const { DocumentName, doc_url, file_name, latitude, longitude, timestamp } = doc;
      if (!groupedResult[DocumentName]) {
        groupedResult[DocumentName] = {
          DocumentName,
          DocumentDetails: []
        };
      }
      //console.log('result',result);
      groupedResult[DocumentName].DocumentDetails.push({ doc_url, file_name, latitude, longitude, timestamp });
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
  const { token } = req.headers

  const {
    LeadID,
    FileName,
    FileUrl
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

  console.log(FileName);


  const query = `INSERT INTO ReportImage(LeadID, FileName, FileUrl, SeqNo) SELECT "${LeadID}", "${FileName}", "${FileUrl}", (COUNT(*)+1) FROM ReportImage WHERE LeadID=${LeadID}`;

  db.query(query, (err, result2) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, data: null, message: "Internal Server Error" });
    }
    if (result2.affectedRows == 0) {
      return res.status(400).json({ status: false, data: result2, message: "survey not found!!" })
    } else {
      res.status(200).json({ status: true, data: "Successfully Updated!!", message: "Successfully Updated!!" })
    }
  });
};

module.exports = {
  getDocuments,
  uploadDocument
};
