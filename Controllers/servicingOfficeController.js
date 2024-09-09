const db = require("../Config/dbConfig");

const getServicingOffice = (req, res) => {
  const sql = "SELECT * FROM vw_OfficeCodesWithOfficeNameWithCode";
  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error while fetching the report documents :", error);
      return res
        .status(500)
        .json({ error: "Error inserting data into report documents :." });
    }

    return res.status(200).json({ results });
  });
};

module.exports = { getServicingOffice };
