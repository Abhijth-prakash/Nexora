const Admin = require("../models/Admin");
const Users = require('../models/User')
const logger = require("../utils/logger");
const {
  ConflictError,
  AuthenticationError,
  NotFoundError,
  AuthorizationError,
  ValidationError,
  OTPError,
} = require("../utils/errors");



class AdminUserService {


//get all users
static async getUsers(id, page) {
    try {
        const admin = await Admin.findById(id)

        if (!admin) {
            throw new AuthenticationError("Authorization required")
        }

        const limit = 8
        const currentPage = Number(page) || 1
        const skip = (currentPage - 1) * limit

        const totalUsers = await Users.countDocuments()
        const totalPages = Math.ceil(totalUsers/limit)

        const users = await Users
            .find()
            .skip(skip)
            .limit(limit)

        logger.info("Fetched users successfully")

        return {
            totalUsers,
            currentPage,
            totalPages,
            users
        }

    } catch (error) {
        logger.error("Failed to fetch users", error)
        throw error
    }
}


//block users

static async blockUser(id, userId) {
  try {
    const admin = await Admin.findById(id)

    if (!admin) {
      throw new AuthenticationError("Authorization required")
    }

    const user = await Users.findById(userId)

    if (!user) {
      throw new NotFoundError("User not found")
    }

    if (user.banned) {
      return true
    }

    user.banned = true
    await user.save()

    logger.info(`Blocked user ${user.name} by admin ${admin.email}`)

    return {email:admin.email,userName:user.name}

  } catch (error) {
    logger.error("Failed to block user", error)
    throw error
  }
}

}

module.exports = AdminUserService