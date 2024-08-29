const userModel = require("../Models/User");
const { errorResponse, successResponse } = require("../Utils/Response");

module.exports = {
  getUserData: async (req, res) => {
    try {
      const { userId } = req.headers;
      console.log("userId", userId);
      const result = await userModel
        .findById(userId)
        .select("-password -deleted -__v -_id");
      successResponse(res, result, "Successfully fetched user data");
    } catch (error) {
      errorResponse(res, error, "error while fetching user data");
    }
  },

  editUserData: async (req, res) => {
    try {
      const { userId } = req.headers;
      const { username, fName, lName, phone, profileImg } = req.body;

      if (!username) throw "Username is required !";

      if (!!phone && `${phone}`.length !== 10)
        throw "Phone number should be 10 digits";

      const result = await userModel
        .findByIdAndUpdate(
          userId,
          {
            username,
            fName,
            lName,
            phone,
            profileImg,
          },
          { new: true }
        )
        .select("-password -deleted -__v -_id");
      successResponse(res, result, "Successfully edited user data");
    } catch (error) {
      errorResponse(res, error, "error while editing user data");
    }
  },
};
