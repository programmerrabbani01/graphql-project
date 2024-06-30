import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isEmail, isMobile } from "../helpers/helpers.js";

const tokenVerify = async (token) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let user = null;
    if (isMobile(decoded.phone)) {
      user = await User.findOne({ phone: decoded.phone }).select("-password");
    } else if (isEmail(decoded.email)) {
      user = await User.findOne({ email: decoded.email }).select("-password");
    }

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error verifying token:", error.message);
    throw new Error("Invalid token");
  }
};

export default tokenVerify;

