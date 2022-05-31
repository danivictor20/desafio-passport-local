import express from "express"
import cookieParser from "cookie-parser"
import session from "express-session"
import 'dotenv/config'
import mongoose from "mongoose"

import rutas from './src/routes/routes.js'

import passport from "passport";
import { objStrategy, objStrategySignup } from "./src/middlewares/passportLocal.js"

const app = express()

passport.use('login', objStrategy);
passport.use('signup', objStrategySignup)

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
        maxAge: Number(process.env.TIME_SESSION_SECONDS) * 1000 // Tiempo de inactividad
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/ecommerce', rutas)

mongoose.connect(process.env.MONGO);

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`http://localhost:${PORT}/ecommerce/`))