
const db = require("../Config/dbConfig");

const getReportDocuments = (req, res) => {
  const LeadId = req.query.leadId;
  console.log("DcoList",LeadId)
  const sql = "SELECT * FROM ReportDocuments WHERE LeadId = ?";
  db.query(sql, [LeadId],  (error, results) => {
    if (error) {
      console.error("Error while fetching the report documents :", error);
      return res
        .status(500)
        .json({ error: "Error inserting data into report documents :." });
    }

    return res.status(200).json({ results });
  });
};


const uploadDocument = (req, res) => {
    const {
        garage,
        reportType,
        fileName,
        fileUrl,
        LeadId,
        uploadedBy
    } = req.body;
 


        const insertUploadDetails = `
        INSERT INTO ReportDocuments (
          LeadId,
          FileName,
          FilePath,
          UploadedBy,
          GarageName,
          ReportType
        ) VALUES (
          '${LeadId}',
          '${fileName}',
          '${fileUrl}',
          '${uploadedBy}',
          '${garage}',
          '${reportType}'
        );
      `;

        db.query(insertUploadDetails, (error, results) => {
          if (error) {
            console.error("Error inserting data into Report Document Upload Details:", error);
            return res
              .status(500)
              .json({ error: "Error inserting data into Report Document Upload Details." });
          }
          return res.status(200).json({ message: "Data inserted successfully." });
        });
  
  };

  module.exports={uploadDocument,getReportDocuments}