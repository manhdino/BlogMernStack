import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  const isCheckEmail = reg.test(email);
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  } else if (!isCheckEmail) {
    next(errorHandler(400, "Email is not a valid email"));
  } else {
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        next(errorHandler(400, "Email is already in use"));
      }
      const hashedPassword = bcryptjs.hashSync(password, 10);

      const createdUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      if (createdUser) {
        res.status(200).json("Create a new account successfully");
      }
    } catch (error) {
      next(errorHandler(400, error));
    }
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  const isCheckEmail = reg.test(email);
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  } else if (!isCheckEmail) {
    next(errorHandler(400, "Email is not a valid email"));
  } else {
    try {
      const validUser = await User.findOne({ email });
      if (!validUser) {
        return next(errorHandler(404, "User not found"));
      }
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
        return next(errorHandler(400, "Invalid password"));
      }
      const token = jwt.sign(
        { id: validUser._id, isAdmin: validUser.isAdmin },
        process.env.JWT_SECRET
      );

      const { password: pass, ...rest } = validUser._doc;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } catch (error) {
      next(error);
    }
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      //if user exists sign in
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      //if not create new user

      //when sign in with google account won't have password so we need to create a new random password
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") + // John Doe --> johndoe
          Math.random().toString(9).slice(-4), // 4 numbers randomly generated
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
