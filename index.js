import express from "express"
import cookieParser from "cookie-parser"
import session from "express-session"
import bcrypt from 'bcrypt'
import 'dotenv/config'
import mongoose from "mongoose"

import rutas from './src/routes/routes.js'

import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "./src/models/usuario.js"

const app = express()



passport.use('login', new Strategy(
    (username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err) return done(err);
   
            if (!user) return done(null, false);
   
            if (!isValidPassword(user, password)) return done(null, false);
   
            return done(null, user);
      });
    })
);

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
}


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

function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

passport.serializeUser((user, done) => {
    done(null, user._id);
});
  
passport.deserializeUser((id, done) => {
    User.findById(id, done);
});



app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
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

app.post('/login', passport.authenticate('login', {failureRedirect: '/error-de-login'}), (req, res) => {
    res.send('estamos bien')
})

app.post('/register', passport.authenticate('signup', {failureRedirect: '/error-de-login'}), (req, res) => {
    res.send('usuario creado')
})

mongoose.connect(process.env.MONGO);


app.listen(8080, () => console.log('http://localhost:8080/'))