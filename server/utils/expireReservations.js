const cron = require("node-cron");
const StockReservation = require("../models/StockReservation");
const OrderService = require("../services/Orderservice");
const logger = require("./logger");

const expireReservations = async () => {
  try {
    const reservations = await StockReservation.find({
      status: "reserved",
      expiresAt: { $lte: new Date() },
    }).select("_id");

    for (const reservation of reservations) {
      await OrderService.expireReservation(reservation._id);
    }

    if (reservations.length) {
      logger.info("Reservation expiry job completed", {
        expiredCount: reservations.length,
      });
    }
  } catch (error) {
    logger.error("Expired reservation job failed", { error });
  }
};

const startReservationJob = () => {
  cron.schedule("* * * * *", expireReservations);
  logger.info("Reservation expiry job scheduled");
};

module.exports = { startReservationJob, expireReservations };