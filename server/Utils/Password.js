const bcrypt = require("bcryptjs");

module.exports = {
  async getHash(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.log("Error", error);
      throw error.message;
    }
  },

  compare(password, hash) {
    try {
      return bcrypt.compare(password, hash);
    } catch (error) {
      console.log("Error", error);
      throw error.message;
    }
  },
};
