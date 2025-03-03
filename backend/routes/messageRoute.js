const router = require("express").Router();
const {
  postMessage,
  getMessages,
} = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/messages", authMiddleware, postMessage);
router.get("/messages", authMiddleware, getMessages);

module.exports = router;
