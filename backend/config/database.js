const mongoose = require("mongoose");

const databaseConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {})
    .then(() => {
      console.log("Mongodb Connected!");
    })
    .catch((e) => {
      console.error(e);
    });
};

module.exports = databaseConnect;
