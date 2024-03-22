const router = require("express").Router();
const { getAllEmailQueues } = require("../controllers/email_queues");

router.route("/").get(getAllEmailQueues);

module.exports = router;
