const router = require("express").Router();
const {
  postMessage,
  getMessages,
  getLastMessages,
} = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/messages", authMiddleware, postMessage);
router.get("/messages", authMiddleware, getMessages);
router.get("/messages/recent", authMiddleware, getLastMessages);

module.exports = router;
