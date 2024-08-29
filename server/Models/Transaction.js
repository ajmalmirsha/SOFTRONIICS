const { Schema, model, default: mongoose } = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const transactionSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: [true, "userId is Required !"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required !"],
    },
    method: {
      type: String,
      enum: ["Deposit", "Withdraw"],
      required: [true, "Method is required !"],
    },
  },
  { timestamps: true }
);

transactionSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const transactionModel = model("transactions", transactionSchema);

module.exports = transactionModel;
