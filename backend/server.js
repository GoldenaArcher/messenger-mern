const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const databaseConnect = require("./config/database");
const authRouter = require("./routes/authRoute");

dotenv.config({
  path: __dirname + "/config/config.env",
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/messenger", authRouter);

const PORT = process.env.PORT || 5000;

databaseConnect();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
