const { errorResponse } = require("../Utils/Response");
const { decodeJwtToken } = require("../Utils/Jwt");
const userModel = require("../Models/User");

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const token = req.headers?.authorization?.split(" ").pop();
      if (!token) {
        errorResponse(
          res,
          "authentication token not found",
          "authentication failed",
          401
        );
      } else {
        const decode = decodeJwtToken(token);
        req.headers.userId = decode.id;
        const user = await userModel.findOne({
          _id: decode.id,
          blocked: false,
        });
        if (!user) {
          return errorResponse(
            res,
            "user blocked",
            "authentication failed",
            401
          );
        }
        next();
      }
    } catch (error) {
      errorResponse(res, error, "Error while decoding token", 401);
    }
  },
};
