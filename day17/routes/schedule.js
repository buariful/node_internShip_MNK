const router = require("express").Router();
const db = require("../models");
const timeSlots = require("../utils/timeSlots.json");

router
  .route("/schedule")
  .post(async (req, res) => {
    try {
      await db.schedule.create(req.body);

      res.render("success");
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  .get(async (req, res) => {
    try {
      const { startDate, endDate, timezone, date } = req.query;
      if (!timezone) {
        return res.status(400).json({
          error: true,
          message: "Timezone is required.",
        });
      }
      let result = {};
      async function getTimes(dateString) {
        const appointments = await db.schedule.findAll({
          where: {
            schedule_date: dateString,
            timezone: timezone,
          },
          attributes: ["schedule_time"],
        });
        const scheduled_times = appointments.map(
          (appointment) => appointment.schedule_time
        );
        return scheduled_times;
      }

      if (startDate && endDate) {
        let currentDate = new Date(startDate);
        const finishingDate = new Date(endDate);
        if (!currentDate || !finishingDate) {
          return res.status(400).json({
            error: true,
            message: "Start and end date are required.",
          });
        }
        while (currentDate <= finishingDate) {
          const dateString = currentDate.toISOString().split("T")[0];
          const allTimes = await getTimes(dateString);
          const availableTimeSlots = timeSlots.filter(
            (time) => !allTimes.includes(time)
          );
          result[dateString] = [...availableTimeSlots];

          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      if (date) {
        const amTimes = [];
        const pmTimes = [];
        const scheduledTimes = await getTimes(date);
        const availableTimeSlots = timeSlots.filter(
          (time) => !scheduledTimes.includes(time)
        );
        availableTimeSlots.forEach((time) => {
          if (time.endsWith("am")) {
            amTimes.push(time);
          } else if (time.endsWith("pm")) {
            pmTimes.push(time);
          }
        });

        result["amTimes"] = amTimes;
        result["pmTimes"] = pmTimes;
      }

      res.status(200).json({
        error: false,
        message: "time slots",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  });

module.exports = router;

/* 
GET, /schedule
try {
      const { startDate, endDate, timezone } = req.query;
      if (!startDate || !endDate || !timezone) {
        return res.status(400).json({
          error: true,
          message: "Start and end date are required.",
        });
      }
      let currentDate = new Date(startDate);
      const finishingDate = new Date(endDate);
      if (!currentDate || !finishingDate) {
        return res.status(400).json({
          error: true,
          message: "Start and end date are required.",
        });
      }

      const result = {};
      while (currentDate <= finishingDate) {
        const dateString = currentDate.toISOString().split("T")[0];
        const appointments = await db.schedule.findAll({
          where: {
            schedule_date: dateString,
            timezone: timezone,
          },
          attributes: ["schedule_time"],
        });
        const scheduled_times = appointments.map(
          (appointment) => appointment.schedule_time
        );

        const availableTimeSlots = timeSlots.filter(
          (time) => !scheduled_times.includes(time)
        );
        result[dateString] = [...availableTimeSlots];

        currentDate.setDate(currentDate.getDate() + 1);
      }

      res.status(200).json({
        error: false,
        message: "time slots",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
*/
