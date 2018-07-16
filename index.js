const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./sql/db.js");

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/images", (req, res) => {
    db.getImages().then(results => {
        res.json(results);
    });
});

const port = 8080;
app.listen(port, () => {
    console.log("listening.....", port);
});
