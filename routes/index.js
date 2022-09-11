const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Opinions = require("../models/Opinions");

// @desc Login/Landing Page
// @route GET/
router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    let current_user_opinions = await Opinions.find({
      user: req.user.id,
    }).lean();
    console.log(current_user_opinions);
    res.render("dashboard", {
      name: req.user.firstName,
      opinions: current_user_opinions,
    });
  } catch (error) {
    console.log(error);
    res.render("./errors/500");
  }
});

module.exports = router;
