import express from "express"
import session from "express-session"
import 'dotenv/config'
import mongoose from "mongoose"

import minimist from "minimist"

import rutas from './src/routes/routes.js'

import passport from "passport";
import { objStrategy, objStrategySignup } from "./src/middlewares/passportLocal.js"

import os from 'os'
import cluster from "cluster"
const numCPU = os.cpus().length

import { logger, loggerWarn, loggerError } from "./src/utils/logger.js"
import compression from "compression"

const app = express()
app.use(compression())

passport.use('login', objStrategy);
passport.use('signup', objStrategySignup)

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

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

app.use((req, res) => {
    logger.warn('La ruta no existe')
    loggerWarn.warn('La ruta que quiere accede no existe')
    res.send('La ruta no existe')
})


mongoose.connect(process.env.MONGO);

const args = minimist(process.argv.slice(2))
const PORT = Number(args.puerto) || 8080
const modoServer = args.modo || 'FORK'


if(modoServer == "CLUSTER"){
    if (cluster.isPrimary) {
        logger.info('Se ejecutó en modo CLUSTER. Creando Workers')
        for (let i = 0; i < numCPU; i++) {
            cluster.fork();
        }
        cluster.on("listening", (worker, address) => {
            logger.info(`Worker: ${worker.process.pid} || Port: ${address.port}`);
        });
    } else {
        app
            .listen(PORT, () => logger.info(`http://localhost:${PORT}/ecommerce/`))
            .on('error', err => logger.error(err))
    }
}else{

    logger.info('Se ejecutó en modo FORK.')
    app
        .listen(PORT, () => logger.info(`http://localhost:${PORT}/ecommerce/`))
        .on('error', err => () => {
            logger.error(err)
            loggerError.error(err)
        })
}


