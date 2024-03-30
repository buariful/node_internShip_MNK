var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const db = require("../models");
const { Op, literal } = require("sequelize");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/email_queue", async (req, res, next) => {
  try {
    // const result = await db.email_queue.findAll({});
    const result = await db.email_queue.findAll({
      include: [
        { model: db.email, as: "email" },
        { model: db.user, as: "user" },
      ],
    });
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

router.get("/test", async (req, res, next) => {
  const activeUsers = await db.user.findAll({ where: { status: 1 } });

  const today = new Date(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const current_day = today.getDay();
  const oddIdEmails =
    current_day === 1 || current_day === 3 || current_day === 5;
  const emails = await db.email.findAll({
    where: literal(`MOD(id, 2) = ${oddIdEmails ? "1" : "0"}`),
  });
  const send_at = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const emailQueueData = [];
  for (const email of emails) {
    for (const user of activeUsers) {
      emailQueueData.push({
        user_id: user.id,
        email_id: email.id,
        status: 0,
        send_at: send_at.toISOString().substring(0, 10), //"YYYY-MM-DD"
        created_at: today,
        updated_at: today,
      });
    }
  }

  await db.email_queue.bulkCreate(emailQueueData);

  res.status(200).json({
    emailQueueData,
    users: activeUsers.length,
    emails: emails.length,
  });
});

// router.get("/test", async (req, res, next) => {
//   var transport = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "e8bc00f7982dac",
//       pass: "7c7c1e15c84a4b",
//     },
//   });
//   const info = await transport.sendMail({
//     from: "hudai@ethereal.email", // sender address
//     to: "arifulcheck@mailinator.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     // text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });
//   res.status(200).json({
//     error: false,
//     info,
//   });
// });

module.exports = router;
