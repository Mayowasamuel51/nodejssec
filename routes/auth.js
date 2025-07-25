const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.js");
// const validate = require("../middlewares/auth.js");
const { registerSchema, loginSchema } = require("../validators/auth.js");

router.post("/register",
    //  validate(registerSchema), 
     register);
router.post("/login", 
    // validate(loginSchema),
     login);

module.exports = router;