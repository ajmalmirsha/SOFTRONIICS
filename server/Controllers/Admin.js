const adminModel = require("../Models/Admin");
const userModel = require("../Models/User");
const transactionModel = require("../Models/Transaction");
const { genJwtToken } = require("../Utils/Jwt");
const { errorResponse, successResponse } = require("../Utils/Response");

module.exports = {
  loginAdmin: async (req, res) => {
    try {
      if (!req.body?.email) throw "email is required !";
      if (!req.body?.password) throw "password is required !";

      const admin = await adminModel
        .findOne({ email: req.body?.email })
        .select("email username password");

      if (!admin) throw "Email not found !";
      if (!(await admin?.comparePassword(req.body?.password))) {
        throw "Incorrect Password !";
      }

      delete admin.password;

      const token = genJwtToken(admin?._id);
      successResponse(
        res,
        {
          token,
          user: {
            username: admin?.username,
            email: admin?.email,
          },
        },
        "admin login successfully"
      );
    } catch (error) {
      errorResponse(res, error, "Failed while login");
    }
  },

  listUsers: async (req, res) => {
    try {
      const result = await userModel.find();
      successResponse(res, result, "successfully fetched user list");
    } catch (error) {
      errorResponse(res, error, "Failed fetching user list");
    }
  },
  blockUser: async (req, res) => {
    try {
      const { userId } = req.body;
      const result = await userModel.findByIdAndUpdate(userId, {
        blocked: true,
      });
      successResponse(res, result, "successfully blocked user");
    } catch (error) {
      errorResponse(res, error, "Failed block user");
    }
  },

  unblockUser: async (req, res) => {
    try {
      const { userId } = req.body;
      const result = await userModel.findByIdAndUpdate(userId, {
        blocked: false,
      });
      successResponse(res, result, "successfully un-blocked user");
    } catch (error) {
      errorResponse(res, error, "Failed un-block user");
    }
  },

  fetchAllTransactions: async (req, res) => {
    try {
      const result = await transactionModel.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $unwind: "$userData",
        },
        {
          $project: {
            id: "$_id",
            _id: 0,
            date: "$createdAt",
            method: "$method",
            amount: "$amount",
            "userData.email": "$userData.email",
            "userData.username": "$userData.username",
            "userData.balance": "$userData.balance",
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
      ]);
      successResponse(res, result, "successfully fetched all transactions");
    } catch (error) {
      errorResponse(res, error, "Failed fetching all transactions");
    }
  },
};
