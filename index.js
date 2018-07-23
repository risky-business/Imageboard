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
app.use(bodyParser.urlencoded({ extended: false }));
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
app.post("/comments", function(req, res) {
    db.addComments(req.body.image_id, req.body.comment, req.body.username).then(
        results => {
            console.log(results);
            res.json({
                success: true,
                results
            });
        }
    );
});
app.get("/comments/:id", (req, res) => {
    db.getComments(req.params.id)
        .then(results => {
            console.log(results);
            res.json(results);
        })
        .catch(err => {
            console.log("error", err);
        });
});

const port = 8080;
app.listen(port, () => {
    console.log("listening.....", port);
});
