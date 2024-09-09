const db = require("../Config/dbConfig");

const getDepreciationRates = (req, res) => {
  const sql = "select * from DepreciationRates";
  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error while getting the depreciations rates", error);
      return res
        .status(500)
        .json({ error: "Error while getting the depreciations rates" });
    }

    return res.status(200).json({ results });
  });
};

module.exports = { getDepreciationRates };
