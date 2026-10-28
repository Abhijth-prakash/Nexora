const cron = require("node-cron");
const StockReservation = require("../models/StockReservation");
const OrderService = require("../services/Orderservice");
const logger = require("./logger");

cron.schedule("* * * * *", async () => {
  try {
    const reservations = await StockReservation.find({
      status: "reserved",
      expiresAt: { $lte: new Date() },
    }).select("_id");

    for (const reservation of reservations) {
      await OrderService.expireReservation(reservation._id);
    }
  } catch (error) {
    logger.error("Expired reservation job failed", { error });
  }
});