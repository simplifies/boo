let { Router } = require("express");
const router = Router();

router.get("/", async (_req, res) => {
  res.render("index.ejs");
});

module.exports = router;
