const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/auth.js");
const validate = require("../middlewares/validate.js");
const { registerSchema, loginSchema } = require("../validators/auth.js");
const authMiddleware = require("../middlewares/auth.js");

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome", user: req.user });
});

router.post("/register",
     validate(registerSchema), 
     register);
router.post("/login", 
    validate(loginSchema),
     login);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;