const db = require("../Config/dbConfig");

const getAllClaims = (req, res) => {
  // const Region1 = req.query.Region
  const token = req.headers["token"]
  const CalimStatus = 1
  // const CalimStatus = '1,2,3,4,5,6,7,8,9,10,11,12,13'

  const userRegions = "SELECT Username,Region1, Region2, Region3, Region4, Region5, Region6 FROM Login WHERE UserID = ?"

  const sql = "CALL GetPolicyInfoByRegionsUpdated(?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(userRegions, [token], (err, loginResult) => {
    if (err) {
      console.error(err);
      return res.json({ status: false, data: null, message: "Internal Server Error" });
    }
    if (loginResult.length === 1) {
      const params = [
        null,null,null,null,null,null,
        null,
        CalimStatus,
        loginResult[0].Username || null,
      ];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.error(err);
          return res.json({ status: false, data: null, message: "Internal Server Error" });
        }
        return res.json({ status: true, data: result[0].reverse(),length: result[0].length,user:loginResult[0], message: "survey found" });
      });
    }
  });
};

module.exports = { getAllClaims };