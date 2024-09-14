
const db = require("../Config/dbConfig");


const loginUser = (req, res) => {
  const { Username, Password } = req.body;
  console.log(Username, Password);

  if (!Username || !Password) {
    return res
      .status(400)
      .json({ status: false, data: null, message: "Required Username and Password" });
  }

  const sql = "SELECT * FROM CMSDB.Login WHERE Username = ? AND Password = ?";
  db.query(sql, [Username, Password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, data: null, message: "Internal Server Error" });
    }
    if (result.length === 1) {
      // Authentication successful
      return res.status(200).json({
        status: true, data: result[0], message: "Login Successful"
      });
    } else {
      // Authentication failed
      return res.status(401).json({ status: false, data: null, message: "Invalid Credentials" });
    }
  });
};

module.exports = { loginUser };