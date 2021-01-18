const mongoose = require("mongoose");

const dbURL = "mongodb://localhost:27017/shop";

mongoose.connect( dbURL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

const shopDB = mongoose.connection;

shopDB.once("open", () => {
    console.log("DB connected :)");
});

shopDB.on("error", (e) => {
    console.error("DB error :(");
    console.error(e);
    process.exit(1);
});

module.exports = { shopDB };