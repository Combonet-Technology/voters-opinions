const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Opinions = require("../models/Opinions");

// @desc    render add page
// @route   GET /opinions/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("opinions/add");
});

// @desc    Process add form
// @route   POST /opinions
router.post("/", ensureAuth, async (req, res) => {
  try {
    console.log(req.body);
    req.body.user = req.user.id;
    await Opinions.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc    Show all opinions
// @route   GET /opinions
router.get("/", ensureAuth, async (req, res) => {
  try {
    const opinions = await Opinions.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("opinions/index", {
      opinions,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc    Show single opinion
// @route   GET /opinions/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let selected_opinion = await Opinions.findById(req.params.id)
      .populate("user")
      .lean();

    if (!selected_opinion) {
      return res.render("error/404");
    }

    if (
      selected_opinion.user._id != req.user.id &&
      selected_opinion.status == "private"
    ) {
      res.render("error/404");
    } else {
      res.render("opinions/show", {
        opinion: selected_opinion,
      });
    }
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
});

// @desc    Show edit page
// @route   GET /opinions/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const selectedOpinion = await Opinions.findOne({
      _id: req.params.id,
    }).lean();

    if (!selectedOpinion) {
      return res.render("error/404");
    }

    if (selectedOpinion.user != req.user.id) {
      res.redirect("/opinions");
    } else {
      res.render("opinions/edit", {
        opinion: selectedOpinion,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    Update story
// @route   PUT /opinions/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let selected_opinion = await Opinions.findById(req.params.id).lean();

    if (!selected_opinion) {
      return res.render("error/404");
    }

    if (selected_opinion.user != req.user.id) {
      res.redirect("/opinions");
    } else {
      selected_opinion = await Opinions.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    Delete story
// @route   DELETE /opinions/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    let current_opinion = await Opinions.findById(req.params.id).lean();

    if (!current_opinion) {
      return res.render("error/404");
    }

    if (current_opinion.user != req.user.id) {
      res.redirect("/opinions");
    } else {
      await Opinions.remove({ _id: req.params.id });
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    User opinions
// @route   GET /opinions/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const opinions = await Opinions.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("opinions/index", {
      opinions,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
