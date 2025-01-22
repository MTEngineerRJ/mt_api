const express = require("express");
const bodyParser = require("body-parser");

const apiRoutes = require("./Routes/apiRoutes");

const port = process.env.PORT || 3006;
const app = express();
var path = require("path");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/apis", apiRoutes);

app.get("/leadDetails/:id", (req, res) => {
  res.redirect('https://play.google.com/store/apps/details?id=vk.apps.mte&referrer=' + req.params.id)
});

app.get('/', (req, res) => {
  res.send('Hello, this is your Express server!');
});

app.use('/privacy_policy', express.static(__dirname + '/privacy_policy.html'));
app.use('/.well-known/assetlinks.json', express.static(__dirname + '/.well-known/assetlinks.json'));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});