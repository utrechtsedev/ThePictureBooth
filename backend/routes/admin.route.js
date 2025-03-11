// admin.route.js
const express = require("express");
const router = express.Router();
const { changePassword, logout, login } = require("../controllers/admin/AdminUser.controller");

// ✅ Admin login
router.post("/login", (req, res) => login(req, res));

// ✅ Admin logout
router.post("/logout", (req, res) => logout(req, res));

// ✅ Change password route
router.post("/change-password", (req, res) => changePassword(req, res));

router.get("/verify-session", (req, res) => {
    if (!req.session) {return res.json({session: false})}
  
    res.json({session: true});
  });

// Export router
module.exports = router;
