const spicedPG = require("spiced-pg");
let db;
if (process.env.DATABASE_URL) {
    db = spicedPG(process.env.DATABASE_URL);
} else {
    db = spicedPG("postgres:Mario:password@localhost:5432/imageboard");
}

exports.getImages = function() {
    const q = "SELECT * FROM images;";
    return db.query(q).then(results => {
        return results.rows;
    });
};
