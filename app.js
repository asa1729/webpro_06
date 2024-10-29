const express = require("express");
const app = express();

//app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.write('Hello, Woeld!\n');
});

app.use( (req, res, next) => {
  res.status(404).send('ページが見つかりません');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));