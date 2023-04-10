const express = require("express");

const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("PLease enter a valid email")
      .custom((value, { req }) => {
        // if (value === "test@test.com")
        //   throw new Error("This email address is forbidden.");
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          //   if (userDoc) {
          //     req.flash("error", "Email exists already, please pick a different one");
          //     return res.redirect("/signup");
          //   }
          if (userDoc) {
            return Promise.reject(
              "Email exists already, please pick a different one"
            );
          }
        });
      }),
    body(
      "password",
      "Please enter a message with only numbers and text and at least 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match");
      }
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
