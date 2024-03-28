var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/get-images", async (req, res) => {
  try {
    const images = await fetch("https://picsum.photos/v2/list")
      .then((response) => {
        return res.status(200).json({});
      })
      .catch((err) => console.log("fetchImages_error", err));
    res.render("images", { data: images });
  } catch (error) {}
});
module.exports = router;
