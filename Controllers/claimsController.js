const db = require("../Config/dbConfig");

const getAllClaims = (req, res) => {
  const Region1 = req.query.Region
  const CalimStatus = 1

  const sql = "CALL GetPolicyInfoByRegions(?, ?, ?, ?, ?, ?, ?, ?)";

  const params = [
    Region1,
    null,
    null,
    null,
    null,
    null,
    CalimStatus,
    null
  ];

  if (!Region1) {
    return res.json({ status: false, data: null, message: "invalid region" });
  }
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ status: false, data: null, message: "Internal Server Error" });
    }
    return res.json({ status: true, data: result[0].reverse(), message: "survey found" });
  });
};

module.exports = { getAllClaims };