const router = require("express").Router();
const {
  postMessage,
  getMessages,
  getLastMessages,
  updateMessageStatus,
  updateMessagesStatus,
} = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/messages", authMiddleware, postMessage);
router.get("/messages", authMiddleware, getMessages);
router.get("/messages/recent", authMiddleware, getLastMessages);
router.patch("/messages/:id/status", authMiddleware, updateMessageStatus);
router.patch("/messages/status", authMiddleware, updateMessagesStatus);

module.exports = router;
