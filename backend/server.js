const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");

const databaseConnect = require("./config/database");
const authRouter = require("./routes/authRoute");
const friendRouter = require("./routes/friendRoute");
const messageRouter = require("./routes/messageRoute");

dotenv.config({
  path: __dirname + "/config/config.env",
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/messenger", authRouter);
app.use("/api/messenger", friendRouter);
app.use("/api/messenger", messageRouter);

const PORT = process.env.PORT || 5000;

databaseConnect();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
