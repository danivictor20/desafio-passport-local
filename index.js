import express from "express"
import cookieParser from "cookie-parser"
import session from "express-session"
import 'dotenv/config'
import mongoose from "mongoose"

import rutas from './src/routes/routes.js'

import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "./src/models/usuario.js"

import { createHash } from "./src/utils/validate.js"

import { objStragy } from "./src/middlewares/passportLocal.js"

const app = express()

passport.use('login', objStragy);


passport.use('signup', new Strategy({
        passReqToCallback: true
    },
    (req, username, password, done) => {
        User.findOne({ 'username': username }, function (err, user) {
   
            if (err) return done(err)
            if (user) return done(null, false)
    
            const newUser = {
                name: req.body.name,
                username: req.body.username,
                password: createHash(password),
            }

            User.create(newUser, (err, userWithId) => {
                if (err) return done(err);
                return done(null, userWithId);
            });
        });
    })
)

passport.serializeUser((user, done) => {
    done(null, user._id);
});
  
passport.deserializeUser((id, done) => {
    User.findById(id, done);
});



app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(cookieParser())
app.use(session({
    secret: 'clave_secreta',
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 20000
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(rutas)

mongoose.connect(process.env.MONGO);

app.listen(8080, () => console.log('http://localhost:8080/'))