const db = require("../Config/dbConfig");

const getAllClaimsold = (req, res) => {
  // const Region1 = req.query.Region
  const token = req.headers["token"]
  const CalimStatus = 1

  const userRegions = "SELECT Region1, Region2, Region3, Region4, Region5, Region6 FROM CMSDB.Login WHERE UserID = ?"

  const sql = "CALL GetPolicyInfoByRegions(?, ?, ?, ?, ?, ?, ?, ?)";

  // if (!Region1) {
  //   return res.json({ status: false, data: null, message: "invalid region" });
  // }

  db.query(userRegions, [token], (err, loginResult) => {
    if (err) {
      console.error(err);
      return res.json({ status: false, data: null, message: "Internal Server Error" });
    }
    if (loginResult.length === 1) {
      const params = [
        loginResult[0].Region1 || null,
        loginResult[0].Region2 || null,
        loginResult[0].Region3 || null,
        loginResult[0].Region4 || null,
        loginResult[0].Region5 || null,
        loginResult[0].Region6 || null,
        CalimStatus,
        null
      ];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.error(err);
          return res.json({ status: false, data: null, message: "Internal Server Error" });
        }
        return res.json({ status: true, data: result[0].reverse(), message: "survey found" });
      });
    }
  });
};
const getAllClaims = (req, res) => {
  // const Region1 = req.query.Region
  const token = req.headers["token"]
  const CalimStatus = '1,2,3,4,5,6,7,8,9,10,11,12,13'

  const userRegions = "SELECT Username,Region1, Region2, Region3, Region4, Region5, Region6 FROM Login WHERE UserID = ?"

  const sql = "CALL GetPolicyInfoByRegionsUpdated(?, ?, ?, ?, ?, ?, ?, ?, ?)";
  // const sql = "CALL GetPolicyInfoByRegions(?, ?, ?, ?, ?, ?, ?, ?)";

  // if (!Region1) {
  //   return res.json({ status: false, data: null, message: "invalid region" });
  // }

  db.query(userRegions, [token], (err, loginResult) => {
    if (err) {
      console.error(err);
      return res.json({ status: false, data: null, message: "Internal Server Error" });
    }
    //     return res.json({ status: false, data: loginResult[0], message: "Internal Server Error" });
    if (loginResult.length === 1) {
      const params = [
        loginResult[0].Region1 || null,
        loginResult[0].Region2 || null,
        loginResult[0].Region3 || null,
        loginResult[0].Region4 || null,
        loginResult[0].Region5 || null,
        loginResult[0].Region6 || null,
        'Spot',
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
