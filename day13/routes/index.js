var express = require("express");
const db = require("../models");
var router = express.Router();
const stripe = require("stripe")(
  "sk_test_51Ows8uF5BKrlUHOAPfpv7pPsF5qzWe9ka9DhZPBvxV9fcZZJHfUmpIxikfG9FYwnvZkJMsnQMMODXyrpKnG6rdFD00brP1bvs4"
);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/product", async (req, res) => {
  try {
    const products = await db.product.findAll();
    res.render("products", { products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await db.product.findByPk(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render("product_detail", { product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Error fetching product");
  }
});

router.post("/checkout", async (req, res) => {
  try {
    const { product_id, total, stripeToken } = req.body;
    const product = await db.product.findByPk(product_id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    const charge = await stripe.charges.create({
      amount: total * 100,
      currency: "usd",
      source: stripeToken,
      description: `Charge for ${product.title}`,
    });
    // Create order record
    await db.order.create({
      product_id,
      total,
      stripe_id: charge.id,
      status: "paid",
    });
    res.redirect(`/thankyou?product_id=${product_id}&total=${total}`);
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send("Error processing payment");
  }
});

router.get("/thankyou", async (req, res) => {
  try {
    const { product_id, total } = req.query;
    const product = await db.product.findByPk(product_id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("thankyou", { product, total });
  } catch (error) {
    console.error("Error fetching product for thank you page:", error);
    res.status(500).send("Error fetching product for thank you page");
  }
});

module.exports = router;
