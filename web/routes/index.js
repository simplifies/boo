let { Router } = require("express");
const router = Router();

router.get("/", async (_eq, res) => {
  res.render("index.ejs");
});
router.post("/", async (req, res) => {
  let password = req.body
  console.log(req.body)
  if (password !== require("../../config.json").password)
    return res.json({ error: "Incorrect password" });
  return res.json();
});
module.exports = router;
