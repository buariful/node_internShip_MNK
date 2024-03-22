const cron = require("node-cron");
const axios = require("axios");
const db = require("../models");
const Customer = db.customer;

const url = "https://53f146-5.myshopify.com/admin/api/2024-01/customers.json";
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

const custormer = async () => {
  try {
    // run in every 2 minutes
    cron.schedule("*/2 * * * *", async () => {
      console.log("start");
      const response = await axios.get(url, {
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
      });
      const allCustomers = [...(response?.data?.customers || [])];

      await Promise.all(
        allCustomers.map(async (customer) => {
          await Customer.findOrCreate({
            where: { shopify_customer_id: customer?.id },
            defaults: {
              shopify_customer_id: customer?.id,
              shopify_customer_email_verified: customer?.verified_email ? 1 : 0,
              // Add other fields as needed
            },
          });
        })
      );
      console.log("end");
    });
  } catch (error) {
    console.log("custormer_cronjob", error?.message);
  }
};

module.exports = custormer;
