const express = require("express");
const {  resetPassword, forgotPassword } = require("../controllers/forgetpassword/forgetPass");
const passwordRouter = express.Router();
// const { requestPasswordReset, resetPassword } = require("./controllers/authController");

passwordRouter.post("/request-reset", forgotPassword);
// passwordRouter.post("/reset-password", resetPassword);
// Attach the token from URL to req.body
passwordRouter.post("/reset-password/:token", (req, res) => {
  req.body.token = req.params.token;
  resetPassword(req, res);
});


// module.exports = router;
module.exports = passwordRouter;
