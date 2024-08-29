const userModel = require("../Models/User");
const { genJwtToken } = require("../Utils/Jwt");
const { successResponse, errorResponse } = require("../Utils/Response");

module.exports = {
  registerUser: async (req, res) => {
    try {
      if (!req.body?.username) throw "username is required !";
      if (!req.body?.email) throw "email is required !";
      if (!req.body?.password) throw "password is required !";

      const result = await userModel.create(req.body);
      const token = genJwtToken(result?._id);
      successResponse(res, { token }, "user registered successfully");
    } catch (error) {
      if (error?.errorResponse?.code === 11000) {
        errorResponse(res, error, "User already exist");
      } else {
        errorResponse(res, error, "Failed while register new user");
      }
    }
  },

  loginUser: async (req, res) => {
    try {
      if (!req.body?.email) throw "email is required !";
      if (!req.body?.password) throw "password is required !";

      const user = await userModel
        .findOne({ email: req.body?.email })
        .select("email username password blocked");
      if (!user) throw "Email not found !";
      if (user?.blocked) throw "User blocked by admin!";
      if (!(await user?.comparePassword(req.body?.password))) {
        throw "Incorrect Password !";
      }

      delete user.password;

      const token = genJwtToken(user?._id);
      successResponse(
        res,
        {
          token,
          user: {
            username: user?.username,
            email: user?.email,
            image: user?.profileImg || "",
          },
        },
        "user login successfully"
      );
    } catch (error) {
      errorResponse(res, error, "Failed while login");
    }
  },
};
