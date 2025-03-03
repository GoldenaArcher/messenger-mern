const router = require("express").Router();
const { getFriends } = require("../controllers/friendController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/friends", authMiddleware, getFriends);

module.exports = router;
