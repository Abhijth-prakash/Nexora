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
static async getUsers(id, page, search) {
  try {
    const admin = await Admin.findById(id)

    if (!admin) {
      throw new AuthenticationError("Authorization required")
    }

    const limit = 8
    const currentPage = Number(page) || 1
    const skip = (currentPage - 1) * limit

    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
          ]
        }
      : {}

    const totalUsers = await Users.countDocuments(searchQuery)
    const totalPages = Math.ceil(totalUsers / limit)

    const users = await Users
      .find(searchQuery)
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

static async unblockUser(id, userId) {
  try {
    const admin = await Admin.findById(id)

    if (!admin) {
      throw new AuthenticationError("Authorization required")
    }

    const user = await Users.findById(userId)

    if (!user) {
      throw new NotFoundError("User not found")
    }

    if (!user.banned) {
      return true
    }

    user.banned = false
    await user.save()

    logger.info(`unBlocked user ${user.name} by admin ${admin.email}`)

    return {email:admin.email,userName:user.name}

  } catch (error) {
    logger.error("Failed to unblock user", error)
    throw error
  }
}

}

module.exports = AdminUserService