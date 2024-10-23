const express = require("express");
const router = express.Router();
const { payment } = require("../controllers/paymentController");

// router.post("/payment", payment);
router.route("/payment").post(payment);


module.exports = router;