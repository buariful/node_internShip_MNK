const { QueryTypes } = require("sequelize");
const {
  getAllEmails,
  createEmail,
  getSingleEmail,
  updateEmail,
  deleteEmail,
} = require("../controllers/emails");
const db = require("../models");
const EmailQueue = db.email_queue;
const User = db.user;
const Email = db.email;

const router = require("express").Router();

router.route("/check").get(async (req, res) => {
  try {
    const activeUsers = await User.findAll({ where: { status: 1 } });

    const today = new Date();
    const isOddDay = today.getDay() % 2 !== 0; // Monday, Wednesday, Friday

    let allEmails = [];
    const logic = isOddDay ? "id%2=1" : "id%2=0";
    allEmails = await db.sequelize.query(`select * FROM email WHERE ${logic}`, {
      type: QueryTypes.SELECT,
    });

    for (const user of activeUsers) {
      for (const email of allEmails) {
        // await EmailQueue.create({
        //   email_id: email.id,
        //   user_id: user.id,
        //   status: 0,
        // send_at: new Date(
        //   today.getFullYear(),
        //   today.getMonth(),
        //   today.getDate() + 1
        // ),
        // });
        const sendAt = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1
        );

        const formattedSendAt = sendAt
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); //// Format sendAt as 'YYYY-MM-DD HH:MM:SS'

        await db.sequelize.query(
          `INSERT INTO email_queue (email_id,user_id,send_at,status,created_at,updated_at) VALUES (${
            email.id
          },${user.id},${formattedSendAt},1,${new Date()},${new Date()})`
        );
      }
    }

    res.status(200).json({ emails: "allEmails" });
  } catch (error) {
    res.status(400).json({ error: true, message: error?.message });
  }
});

router.route("/").get(getAllEmails).post(createEmail);
router.route("/:id").get(getSingleEmail).put(updateEmail).delete(deleteEmail);

module.exports = router;
