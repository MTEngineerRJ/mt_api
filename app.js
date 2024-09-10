const express = require("express");
const bodyParser = require("body-parser");

const apiRoutes = require("./Routes/apiRoutes");
const multer = require("multer");


const dotenv = require("dotenv").config();
const port = process.env.PORT || 3006;
const app = express();

const storage = multer.memoryStorage(); 
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, 
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/apis",apiRoutes);

app.get('/', (req, res) => {
  res.send('Hello, this is your Express server!');
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
