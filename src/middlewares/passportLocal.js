import { isValidPassword, createHash } from "../utils/validate.js"
import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../models/usuario.js"

export const objStragy = new Strategy(
    (username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false);
            if (!isValidPassword(user, password)) return done(null, false);
   
            return done(null, user);
      });
    })