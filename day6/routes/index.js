var express = require("express");
var router = express.Router();
const axios = require("axios");

// const url = "https://53f146-5.myshopify.com/admin/api/2024-01/products.json";
const url = "https://844268-7c.myshopify.com/admin/api/2024-01/products.json";
const accessToken = "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";
const headers = {
  "X-Shopify-Access-Token": accessToken,
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/products", async (req, res, next) => {
  try {
    const response = await axios.get(url, {
      headers,
    });
    const products = response?.data?.products;
    const itemsPerPage = 3;
    const page = req.query.page || 1;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    res.render("products", {
      products: paginatedProducts,
      currentPage: page,
      totalPages: Math.ceil(products.length / itemsPerPage),
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message || "Internal server error",
    });
  }
});

module.exports = router;
