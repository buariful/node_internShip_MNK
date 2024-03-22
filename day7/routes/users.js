var express = require("express");
const router = express.Router();
const db = require("../models");
const Web3Service = require("../services/Web3Service");
const User = db.user;

const wb3 = new Web3Service();

/* 
GET /api/v1/user (get all)
GET /api/v1/user/:id (get one)
POST /api/v1/user/:id (add one)
PUT /api/v1/user/:id (update one)
DELETE /api/v1/user/:id (delete one)
*/

/* GET users. */
router
  .route("/user")
  .get(async (_req, res) => {
    try {
      const allUsers = await User.findAll({});
      res.status(200).json({
        error: false,
        list: allUsers,
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  /* create user */
  .post(async (req, res) => {
    try {
      const result = await User.create(req.body);
      res
        .status(200)
        .json({ error: false, message: "user created", data: result });
    } catch (error) {}
  });

router.post("/user/wallet", async (req, res, next) => {
  try {
    const { user_id } = req.body;
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    const web3Service = new Web3Service();
    const { privateKey, address } = web3Service.createWallet();

    await User.update(
      {
        wallet_id: address,
      },
      { where: { id: user_id } }
    );

    res.status(201).json({
      error: false,
      privateKey,
      message: "Wallet created successfully",
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

router.route("/user/account").get(async (req, res) => {
  try {
    const { private_key } = req.query;
    const balance = await new Web3Service().getBalance(private_key);

    res.status(200).json({
      error: false,
      data: balance,
    });
  } catch (error) {
    res.status(400).json({ error: true, message: error?.message });
  }
});

/* sign */
router.route("/user/sign").get(async (req, res) => {
  try {
    const privateKey = req.query.private_key;
    if (!privateKey) {
      return res
        .status(400)
        .json({ error: true, message: "Private key is required." });
    }

    const payload = "This is a demo message!";
    const signature = await wb3.userSign(payload, privateKey);

    res.status(200).json({
      error: false,
      payload: signature,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: "Internal server error." });
  }
});

/* transfer request */
router.route("/user/transfer").post(async (req, res, next) => {
  try {
    // private_key=sdfdsf&to_address=fdgfdg&amount
    const { private_key, to_address, amount } = req.query;
    const reciept = await wb3.sendTransaction(private_key, to_address, amount);
    res.status(200).json({ reciept });
  } catch (error) {
    res.status(400).json({ error: true, message: error?.message });
  }
});

router
  .route("/user/:id")
  /* get single user */
  .get(async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      res.status(200).json({
        error: false,
        model: user,
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  /* update user */
  .put(async (req, res) => {
    try {
      await User.update(req.body, {
        where: { id: req.params.id },
      });
      res.status(200).json({ error: false, message: "user updated" });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  /* delete user */
  .delete(async (req, res) => {
    try {
      await User.destroy({ where: { id: req.params.id } });

      res.status(200).json({ error: false, message: "user deleted" });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  });

module.exports = router;
