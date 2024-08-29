const { Schema, model } = require("mongoose");
const { getHash, compare } = require("../Utils/Password");

const adminSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is Required !"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required !"],
    select: false,
  },
});

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await getHash(this.password);
  }
  next();
});

adminSchema.methods.comparePassword = function (password) {
  return compare(password, this.password);
};

const adminModel = model("admins", adminSchema);

module.exports = adminModel;
