const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../../models/userModel");
// const User = require("../../models/User");


// Forgot password endpoint
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const resetLink = `http://localhost:3000/resetP/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click this link to reset your password (valid 1 hour):</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset password endpoint
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).json({ message: "Token and new password required" });

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(14);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { forgotPassword, resetPassword };
