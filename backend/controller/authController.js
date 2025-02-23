const { formidable } = require("formidable");
const validator = require("validator");
const { extractFields } = require("../utils/formidableUtils");
const { randomBytes } = require("node:crypto");
const registerModel = require("../model/authModel");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.userRegister = (req, res) => {
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    const { username, email, password, confirmPassword } =
      extractFields(fields);
    const { image } = extractFields(files);

    const errors = [];

    if (!username) {
      errors.push("Please provide your username.");
    }
    if (!email) {
      errors.push("Please provide your email.");
    }
    if (email && !validator.isEmail(email)) {
      errors.push("Please provide valid email.");
    }
    if (!password) {
      errors.push("Please provide your password.");
    }
    if (password && password.length < 6) {
      errors.push("Password must be at least 6 characters.");
    }
    if (!confirmPassword) {
      errors.push("Please provide your confirm password.");
    }
    if (password && confirmPassword && password !== confirmPassword) {
      errors.push("Your password and confirm password does not match.");
    }
    if (!image) {
      errors.push("Please provide user profile image.");
    }
    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: "User registered failed due to bad requests.",
        errors,
      });
    } else {
      var token = randomBytes(16).toString("hex");
      const fileExtension = path.extname(image.originalFilename);
      const newImageName = `${token}${fileExtension}`;

      const uploadDir = path.join(__dirname, "..", "uploads");
      const newPath = path.join(uploadDir, newImageName);

      // Ensure the upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      try {
        const existedUser = await registerModel.findOne();
        if (existedUser) {
          res.status(409).json({
            error: {
              errorMessage: ["Your email already existed."],
            },
          });
        } else {
          fs.renameSync(image.filepath, newPath);
          const imageUrl = `/uploads/${newImageName}`;

          const newUser = await registerModel.create({
            username,
            email,
            password: bcrypt.hashSync(password, 10),
            image: imageUrl,
          });

          const token = jwt.sign(
            {
              id: newUser._id,
              email: newUser.email,
              username: newUser.username,
              image: newUser.image,
              createdAt: newUser.updatedAt,
            },
            process.env.SECRET,
            { expiresIn: process.env.TOKEN_EXP }
          );

          // const options = {
          //   expires: new Date(
          //     Date.now() + Number(process.env.COOKIE_EXP) * 24 * 60 * 60 * 1000
          //   ),
          // };

          res
            .status(201)
            // .cookie("authToken", token, options)
            .json({
              success: true,
              message: "User registered successfully.",
              data: {
                token,
              },
            });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: "Internal errors.",
          errors,
        });
      }
    }
  });
};
