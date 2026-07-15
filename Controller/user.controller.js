const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendMessage } = require("../kafka/producer");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill all details" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ error: "User Already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await sendMessage("send-email", {
      name: user.name,
      email: user.email,
    });

    console.log("✅ Email event pushed to Kafka");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(201).json({
      success: true,
      message: "Registration Successfully",
      name: user.name,
      email: user.email,
      password: user.password,
      id: user._id,
      token: generatetoken(user._id),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all details" });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        success: true,
        message: "Login Successfully",
        name: user.name,
        email: user.email,
        id: user._id,
        token: generatetoken(user._id),
      });
    } else {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generatetoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { registerUser, generatetoken, loginUser };
