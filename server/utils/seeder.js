const User = require("../models/User");
const logger = require("./logger");
const Admin = require('../models/Admin')
const config = require('../config/config')


const seedAdmin = async () => {
  try {
    const adminEmail = config.admin.EMAil || "admin@admin.com";
    const adminPassword = config.admin.PASSWORD || "admin123";

    const existingAdmin = await Admin.findByEmail(adminEmail);
    if (!existingAdmin) {
      const admin = new Admin({
        name: "Admin",
        email: adminEmail,
        password: adminPassword,
      });

      await admin.save();
      logger.info(`Admin created with email: ${adminEmail}`);
    } else {
      logger.info("Admin already exists");
    }
  } catch (error) {
    logger.error("Error seeding admin:", error);
  }
};

const seedSampleUsers = async () => {
  try {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const sampleUsers = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        status: "active",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        status: "active",
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        password: "password123",
        status: "banned",
      },
    ];

    for (const userData of sampleUsers) {
      const existingUser = await User.findByEmail(userData.email);
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        logger.info(`Sample user created: ${userData.email}`);
      }
    }
  } catch (error) {
    logger.error("Error seeding sample users:", error);
  }
};

const runSeeders = async () => {
  try {
    await seedAdmin();
    await seedSampleUsers();
    logger.info("Database seeding completed");
  } catch (error) {
    logger.error("Database seeding failed:", error);
  }
};

module.exports = {
  runSeeders,
};