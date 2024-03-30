const { Op, literal } = require("sequelize");
const db = require("../models");
const EmailQueue = db.email_queue;
const User = db.user;
const Email = db.email;
const cron = require("node-cron");

const processEmailQueue = async () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("cronjobStart->>", new Date());
    try {
      const activeUsers = await db.user.findAll({ where: { status: 1 } });

      const today = new Date(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      const current_day = today.getDay();
      const send_at = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const oddIdEmails =
        current_day === 1 || current_day === 3 || current_day === 5;
      const emails = await db.email.findAll({
        where: literal(`MOD(id, 2) = ${oddIdEmails ? "1" : "0"}`),
      });

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
    } catch (error) {
      console.error("Error processing email queue:", error);
    }
    console.log("cronjobEnd->>", new Date());
  });
};

module.exports = processEmailQueue;
