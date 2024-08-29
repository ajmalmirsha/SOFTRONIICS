const { errorResponse } = require("../Utils/Response");
const { decodeJwtToken } = require("../Utils/Jwt");
const adminModel = require("../Models/Admin");

module.exports = {
  authenticateAdmin: async (req, res, next) => {
    try {
        console.log("on auth admin");
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
        const admin = await adminModel.findById(decode.id);
        console.log("admin", admin, decode.id)
        if (!admin) {
          return errorResponse(
            res,
            "authorization failed admin can only access",
            "authentication failed",
            401
          );
        }
        req.headers.adminId = decode.id;
        next();
      }
    } catch (error) {
      errorResponse(res, error, "Error while decoding token", 401);
    }
  },
};
