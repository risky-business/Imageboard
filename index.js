const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./sql/db.js");
const s3 = require("./s3");
const config = require("./config");

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/images", (req, res) => {
    db.getImages().then(results => {
        res.json(results);
    });
});

app.get("/images/:id", (req, res) => {
    db.getImagesId(req.params.id).then(results => {
        res.json(results);
    });
});
// app.get("/comment/:imageid", (req, res) => {});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    if (req.file) {
        console.log(req.file);

        res.json({ success: true });
    } else {
        console.log("something is wrong, check for error");
        res.json({ success: false });
    }
    db.insertImage(
        config.s3Url + req.file.filename,
        req.body.username,
        req.body.title,
        req.body.desc
    ).then(results => {
        res.json({
            success: true,
            image: results
        });
    });
});

const port = 8080;
app.listen(port, () => {
    console.log("listening.....", port);
});
