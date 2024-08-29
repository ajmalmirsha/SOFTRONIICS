const jwt = require("jsonwebtoken");

module.exports = {
  genJwtToken: (id) => {
    try {
      const payload = { id };
      return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    } catch (error) {
      throw error?.message;
    }
  },

  decodeJwtToken: (token) => {
    try {
      return jwt.decode(token, { json: true });
    } catch (error) {
      throw error?.message;
    }
  },
};
