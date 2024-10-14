import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      // Find the user by username in the database
      const user = await User.findOne({ username });

      // If there's an error or no user is found
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      // If both the username and password are correct, return the user
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  console.log("We are inside serializeUser");

  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    console.log("We are inside deserializeUser");
    const user = await User.findById(_id);
    done(null, user._id);
  } catch (error) {
    done(error);
  }
});
