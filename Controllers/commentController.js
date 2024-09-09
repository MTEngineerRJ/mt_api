const db = require("../Config/dbConfig");

const addComment = (req, res) => {
  const { LeadID, Comment, UserName } = req.body;

  const insertQuery = `
      INSERT INTO comments (
        LeadID,
        Comment,
        UserName
      ) VALUES (
        '${LeadID}',
        '${Comment}',
        '${UserName}'
      );
    `;

  db.query(insertQuery, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).json({ message: "Added successfully", result });
  });
};

const getCommentsById = async (req, res) => {
  const leadId = req.query.leadId;

  db.query(
    "SELECT * FROM comments WHERE LeadID = ? ORDER BY AddedDate DESC",
    [leadId],
    (error, results) => {
      if (error) {
        console.error("Error fetching data from comments table:", error);
        return res
          .status(500)
          .json({ error: "Error fetching data from comments table." });
      }
      return res.status(200).json({ results });
    }
  );
};

module.exports = { getCommentsById, addComment };
