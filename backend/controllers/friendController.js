const User = require("../models/authModel");

module.exports.getFriends = async (req, res) => {
  try {
    const friendList = await User.find({ _id: { $ne: req.user.id } });
    res.status(200).json({ success: true, data: friendList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
