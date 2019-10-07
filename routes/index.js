const express = require("express"),
      router  = express.Router();

// Landing Route // 
router.get("/", (req, res) => {
    res.render("landing");
});

module.exports = router;