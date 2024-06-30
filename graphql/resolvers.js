import {
  createOTP,
  dotsToHyphens,
  hyphensToDots,
  isEmail,
  isMobile,
  isUserName,
} from "../helpers/helpers.js";
import { AccountActivationEmail } from "../mails/AccountActivationMail.js";
import tokenVerify from "../middlewares/verifyToken.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const resolvers = {
  Query: {
    getAllUsers: async () => {
      return await User.find().select("-password");
    },

    loggedInUser: async (_, __, context ) => {
      try {
        const { req, res } = context;
        const token = req.cookies.accessToken;
        if (!token) {
          throw new Error("No token provided");
        }
        return await tokenVerify(token);
      } catch (error) {
        console.error("Error in loggedInUser resolver:", error.message);
        throw new Error("Unauthorized");
      }
    },
    // getSingleStudent: async (_, { id }) => {
    //   const data = await Student.findById(id);

    //   return data;
    // },
  },

  Mutation: {
    userLogin: async (_, { email, phone, password }) => {
      console.log("email:", email);
      console.log("phone:", phone);

      // Validation
      if ((!email && !phone) || !password) {
        throw new Error("Email or phone and password are required");
      }

      let loginUserData = null;

      if (phone && isMobile(phone)) {
        loginUserData = await User.findOne({ phone: phone });

        if (!loginUserData) {
          throw new Error("User not found");
        }
      } else if (email && isEmail(email)) {
        loginUserData = await User.findOne({ email: email });

        if (!loginUserData) {
          throw new Error("User not found");
        }
      } else {
        throw new Error("A valid mobile number or email address is required");
      }

      // Password check
      const passwordCheck = await bcrypt.compare(
        password,
        loginUserData.password
      );

      if (!passwordCheck) {
        throw new Error("Wrong password");
      }

      // Create access token
      const token = jwt.sign(
        { id: loginUserData._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
        }
      );

      return {
        token,
        user: loginUserData,
        message: "User login successful",
      };
    },
    userLogout: async (_,__, context) => {
      const { req, res } = context;

      res.clearCookie("accessToken");
      return { message: "Logout successful" };
    },
    userRegistration: async (
      _,
      { name, userName, email, phone, password, conformPassword },
      context
    ) => {
      try {
        const { res } = context;

        // Check if all fields are provided
        if (
          !name ||
          !userName ||
          !email ||
          !phone ||
          !password ||
          !conformPassword
        ) {
          throw new Error("All fields are required");
        }

        // Validate user name
        if (!isUserName(userName)) {
          throw new Error("Invalid userName format");
        }

        // Validate email
        if (!isEmail(email)) {
          throw new Error("Invalid email format");
        }

        // Validate phone
        if (!isMobile(phone)) {
          throw new Error("Invalid phone number format");
        }

        // Check for existing user name
        const userNameCheck = await User.findOne({ userName });
        if (userNameCheck) {
          throw new Error("User Name already exists");
        }

        // Check for existing email
        const userEmailCheck = await User.findOne({ email });
        if (userEmailCheck) {
          throw new Error("Email already exists");
        }

        // Check for existing phone
        const userPhoneCheck = await User.findOne({ phone });
        if (userPhoneCheck) {
          throw new Error("Phone number already exists");
        }

        // Check if passwords match
        if (password !== conformPassword) {
          throw new Error("Confirm password does not match with password");
        }

        // Hash the password
        const hashPass = await bcrypt.hash(password, 10);

        // Create a verification token for account activation
        const activationCode = createOTP();
        const verifyToken = jwt.sign(
          { email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15m",
          }
        );

        // Set the activation link and send email
        const activationLink = `http://localhost:3000/verify/${dotsToHyphens(
          verifyToken
        )}`;
        await AccountActivationEmail(email, {
          name,
          code: activationCode,
          link: activationLink,
        });

        res.cookie("verifyToken", verifyToken);

        // Create new user
        const newUser = new User({
          name,
          userName,
          email,
          phone,
          password: hashPass,
          conformPassword: hashPass,
          accessToken: activationCode,
        });

        await newUser.save(); // Save the new user to the database

        // Return the new user and success message
        return {
          user: newUser,
          message: "User created successfully",
        };
      } catch (error) {
        console.error("Error in userRegistration resolver:", error);
        throw error; // Re-throw other errors to be handled by Apollo Server
      }
    },

    userVerification: async (_, { token }, context) => {
      const { req, res } = context;

      if (!token) {
        return res.status(400).json({ message: "Invalid token" });
      }

      const verifyToken = hyphensToDots(token);

      // verify the token

      const tokenCheck = jwt.verify(
        verifyToken,
        process.env.ACCESS_TOKEN_SECRET
      );

      if (!tokenCheck) {
        return res.status(400).json({ message: " Invalid Active Request " });
      }

      // activate account now

      let activateUser = null;

      if (isEmail(tokenCheck.email)) {
        activateUser = await User.findOne({ email: tokenCheck.email });

        if (!activateUser) {
          return res.status(400).json({ message: "User not found" });
        }
      } else {
        return res.status(400).json({ message: " Email is Undefined" });
      }

      activateUser.accessToken = null;
      activateUser.save();

      // clear token
      res.clearCookie("verifyToken");

      return res
        .status(200)
        .json({ message: " User Activation Successful", user: activateUser });
    },
  },
};
