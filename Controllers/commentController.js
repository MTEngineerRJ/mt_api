const db = require("../Config/dbConfig");

const getComments = (req, res) => {
  const LeadID = req.query.LeadID

  const sql = "SELECT LeadID, Comment, AddedDate, UserName as Username, modifiedtimestamp FROM comments WHERE LeadID = ? ORDER BY AddedDate DESC";

  if (!LeadID) {
    return res.json({ status: false, data: null, message: "lead id can't be blank" });
  }
  db.query(sql, [LeadID], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ status: false, data: null, message: "Internal Server Error" });
    }
    return res.json({ status: true, data: result, message: "comments found" });
  });
};

const addComment = (req, res) => {
  const { LeadID, Comment, Username } = req.body;

  if (!LeadID) {
    return res.json({ status: false, data: null, message: "lead id can't be blank" });
  }

  const insertQuery = `
      INSERT INTO comments (
        LeadID,
        Comment,
        UserName
      ) VALUES (
        '${LeadID}',
        '${Comment}',
        '${Username}'
      );
    `;

  db.query(insertQuery, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ status: false, data: null, message: "Internal Server Error" });
    }
    return res.json({ status: true, data: "comments added", message: "comments added" });
  });
};

module.exports = { getComments, addComment };