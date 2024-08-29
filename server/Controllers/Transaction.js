const { default: mongoose } = require("mongoose");
const transactionModel = require("../Models/Transaction");
const userModel = require("../Models/User");
const { errorResponse, successResponse } = require("../Utils/Response");

module.exports = {
  deposit: async (req, res) => {
    try {
      const { amount } = req.body;
      const { userId } = req.headers;
      if (!userId) throw "userId is required!";
      if (!amount) throw "amount is required!";
      if (amount <= 0 || isNaN(Number(amount))) throw "Enter a valid amount";

      const result = await transactionModel.create({
        userId,
        amount,
        method: "Deposit",
      });

      await userModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $inc: { balance: Number(amount) } }
      );
      successResponse(res, result, "amount deposited successfully");
    } catch (error) {
      errorResponse(res, error, "error while depositing money");
    }
  },

  withdraw: async (req, res) => {
    try {
      const { amount, password } = req.body;
      const { userId } = req.headers;
      if (!userId) throw "userId is required!";
      if (!amount) throw "amount is required!";
      if (amount <= 0 || isNaN(Number(amount))) throw "Enter a valid amount";

      const user = await userModel.findById(userId).select("+password");

      if (!user) throw "invalid userId";

      console.log("pass", password);

      if (!(await user.comparePassword(password))) throw "Incorrect password !";

      if (user.balance < amount) throw "Insufficient balance !";

      const result = await transactionModel.create({
        userId,
        amount,
        method: "Withdraw",
      });

      await userModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $inc: { balance: -Number(amount) } }
      );
      successResponse(res, result, "amount withdraw successfully");
    } catch (error) {
      errorResponse(res, error, "error while depositing money");
    }
  },

  getDetails: async (req, res) => {
    try {
      const { userId } = req.headers;
      if (!userId) throw "userId is required!";

      const result = await transactionModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $facet: {
            totals: [
              {
                $group: {
                  _id: "$method",
                  totalAmount: { $sum: "$amount" },
                },
              },
            ],
            transactions: [{ $sort: { createdAt: -1 } }],
          },
        },

        {
          $project: {
            transactions: 1,
            WithdrawTotal: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$totals",
                        as: "item",
                        cond: { $eq: ["$$item._id", "Withdraw"] },
                      },
                    },
                    0,
                  ],
                },
                { totalAmount: 0 },
              ],
            },
            DepositTotal: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$totals",
                        as: "item",
                        cond: { $eq: ["$$item._id", "Deposit"] },
                      },
                    },
                    0,
                  ],
                },
                { totalAmount: 0 },
              ],
            },
          },
        },
        {
          $project: {
            WithdrawTotal: "$WithdrawTotal.totalAmount",
            DepositTotal: "$DepositTotal.totalAmount",
            transactions: "$transactions",
          },
        },
      ]);

      const output = result[0] || {
        transactions: [],
        WithdrawTotal: 0,
        DepositTotal: 0,
        balance: 0,
      };

      const userData = await userModel.findById(userId).select("balance");
      output.balance = userData?.balance || 0;

      successResponse(res, output, "amount deposited successfully");
    } catch (error) {
      errorResponse(res, error, "error while depositing money");
    }
  },
};
