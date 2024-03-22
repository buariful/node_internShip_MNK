const { Op } = require("sequelize");
const db = require("../models");
const EmailQueue = db.email_queue;
const User = db.user;
const Email = db.email;

const processEmailQueue = async () => {
  try {
    const activeUsers = await User.findAll({ where: { status: 1 } });

    const today = new Date();
    const isOddDay = today.getDay() % 2 !== 0; // Monday, Wednesday, Friday

    let allEmails = [];
    if (isOddDay) {
      allEmails = await Email.findAll({
        where: {
          id: {
            [Op.and]: [
              sequelize.where(sequelize.col("id"), "mod", 2), // Check if ID is odd
            ],
          },
        },
      });
    }

    for (const user of activeUsers) {
      const emailsToSend = await Email.findAll({
        where: { userId: user.id, id: { [db.Sequelize.Op.mod]: [1, 0] } },
      });

      for (const email of emailsToSend) {
        // Create email queue records
        await EmailQueue.create({
          userId: user.id,
          emailId: email.id,
          status: "not sent",
          send_at: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1
          ),
        });
      }
    }

    return res.json({ allEmails });
  } catch (error) {
    console.error("Error processing email queue:", error);
  }
};

// cron.schedule("0 0 * * *", async () => {
//   console.log("Running email queue job...");
//   await processEmailQueue();
// });

module.exports = processEmailQueue;
