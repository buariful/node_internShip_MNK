const router = require("express").Router();
const axios = require("axios");

const url = "https://53f146-5.myshopify.com/admin/api/2024-01";
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

router.route("/products").get(async (req, res) => {
  try {
    const response = await axios.get(`${url}/products.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    });

    const products = response?.data?.products;
    const itemsPerPage = 3;
    const page = req.query.page || 1;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.status(200).json({
      list: paginatedProducts,
      page,
      totalPages: Math.ceil(paginatedProducts?.length / itemsPerPage),
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message || "Internal server error",
    });
  }
});

router
  .route("/customer")
  // creating customer api worked once, but not working from second time.
  .post(async (req, res) => {
    try {
      const response = await axios.post(`${url}/customers.json`, req.body, {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      });

      res.status(201).json({
        error: false,
        message: "customer created",
        data: response?.data,
        // body: req.body,
      });
    } catch (error) {
      res.status(error?.status || 400).json({
        error: true,
        // dd: error,
        message: error?.message || "can not be created",
      });
    }
  })
  .get(async (_req, res) => {
    try {
      const response = await axios.get(`${url}/customers.json`, {
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
      });

      res.status(200).json({
        error: false,
        message: "customers",
        data: response?.data?.customers,
      });
    } catch (error) {
      res.status(error?.status || 400).json({
        error: true,
        message: error?.message,
      });
    }
  });

module.exports = router;
