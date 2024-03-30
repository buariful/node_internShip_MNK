const { Op, literal } = require("sequelize");
const nodemailer = require("nodemailer");
const db = require("../models");
const EmailQueue = db.email_queue;
const User = db.user;
const Email = db.email;
const cron = require("node-cron");

const sendingEmail = async () => {
  cron.schedule("0 1 * * *", async () => {
    console.log("sendingEmail_start->>", new Date());
    try {
      const sendEmails = async (emails) => {
        const transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "e8bc00f7982dac",
            pass: "7c7c1e15c84a4b",
          },
        });

        const emailPromises = emails.map(async (email) => {
          await transport.sendMail(email);
        });

        await Promise.all(emailPromises);
      };

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const emailQueueRecords = await db.email_queue.findAll({
        where: {
          send_at: today,
        },
        include: [{ model: db.email }, { model: db.user }],
      });

      const emails = [];
      for (const record of emailQueueRecords) {
        const { email, name } = record.user;
        const { subject, body } = record.email;
        const replacedBody = body
          .replace("{{{name}}}", name)
          .replace("{{{email}}}", email);

        emails.push({
          from: "hudai@ethereal.email",
          to: email,
          subject: subject,
          html: replacedBody,
        });
      }

      await sendEmails(emails);
      await db.email_queue.destroy({ where: { send_at: today } });

      console.log("all email sent");
    } catch (error) {
      console.log("senemail->>", error);
    }
    console.log("sendingEmail_end->>", new Date());
  });
};

module.exports = sendingEmail;
