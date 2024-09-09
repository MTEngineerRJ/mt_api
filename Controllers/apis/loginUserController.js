
const db = require("../../Config/dbConfig");


const loginUser = (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  if (!username || !password) {
    return res
      .status(400)
      .json({ status: false, data: null, message: "Username and password are required" });
  }

  const sql = "SELECT * FROM employees WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, data: null, message: "Internal Server Error" });
    }
    if (result.length === 1) {
      // Authentication successful
      if (result[0].status) {
        return res.status(200).json({
          status: true, data: result[0], message: "Login successful"
        });
      } else {
        return res.status(401).json({
          status: false, data: null, message: "user not active"
        });
      }
    } else {
      // Authentication failed
      return res.status(401).json({ status: false, data: null, message: "Invalid credentials" });
    }
  });
};

module.exports = { loginUser };