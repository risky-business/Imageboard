const spicedPG = require("spiced-pg");
let db;
if (process.env.DATABASE_URL) {
    db = spicedPG(process.env.DATABASE_URL);
} else {
    db = spicedPG("postgres:Mario:password@localhost:5432/imageboard");
}

exports.getImages = function() {
    const q = "SELECT * FROM images ORDER BY id DESC;";
    return db.query(q).then(results => {
        return results.rows;
    });
};

exports.insertImage = function(url, username, title, desc) {
    const params = [url, username, title, desc];
    const q = `
        INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `;
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
exports.getImagesId = function(id) {
    const params = [id];
    const q = "SELECT * FROM images WHERE id = $1;";
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
