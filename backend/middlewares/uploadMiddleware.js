const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

module.exports = { uploadDir };
