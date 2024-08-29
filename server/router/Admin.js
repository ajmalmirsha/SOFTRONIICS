const express = require("express");
const {
  loginAdmin,
  listUsers,
  unblockUser,
  blockUser,
  fetchAllTransactions,
} = require("../Controllers/Admin");
const AdminAuth = require("../Middlewares/AdminAuth");


const router = express.Router();


router.post("/login", loginAdmin);

router.use(AdminAuth.authenticateAdmin)

router.get("/list/users", listUsers);
router.put("/block-user", blockUser);
router.put("/unblock-user", unblockUser);
router.get("/transactions", fetchAllTransactions);

module.exports = router;
