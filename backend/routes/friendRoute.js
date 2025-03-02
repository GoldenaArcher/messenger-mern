const router = require("express").Router();
const { getFriends } = require("../controller/friendController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/friend", authMiddleware, getFriends);

module.exports = router;
