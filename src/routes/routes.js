import { Router } from 'express'
import passport from "passport";

import { isAuth } from '../middlewares/authenticated.js'
import { listaProductos } from '../controllers/userController.js'
const rutas = Router()

import { fork } from "child_process";
import os from 'os'

import { logger, loggerError } from '../utils/logger.js'

/**
 * Rutas get para renderizar las vistas
 */
rutas.get('/', isAuth, listaProductos)

rutas.get('/login', (req, res) => {
    try {
        logger.info('Se ejecutó el render de login')
        if (req.isAuthenticated()) return res.redirect('/ecommerce')
        res.render('login')
    } catch (error) {
        logger.error('Se produjo un error:' + error.message)
        res.send("Error")
    }
})

rutas.get('/register', (req, res) => {
    try {
        logger.info('Se ejecutó el render de register')
        if (req.isAuthenticated()) return res.redirect('/ecommerce')
    res.render('register')
    } catch (error) {
        logger.error('Se produjo un error:' + error.message)
        res.send("Error")
    }
})

rutas.get('/error', (req, res) => {
    try {
        logger.info('No estas logueado amigo')
        if (req.isAuthenticated()) return res.redirect('/ecommerce')
        res.render('error-login')
    res.render('register')
    } catch (error) {
        logger.error('Se produjo un error:' + error.message)
        res.send("Error")
    }
})

rutas.get('/logout', isAuth, (req, res) => {
    try {
        logger.info('Usuario deslogueado')
        req.logout(err => {
            if (err) return err
            res.redirect('/ecommerce/login')
        })
    res.render('register')
    } catch (error) {
        logger.error('Se produjo un error:' + error.message)
        res.send("Error")
    }
})

rutas.get('/info', (req, res) => {

    try {
        logger.info('esto es un logger de info')
        const dataProcess = {
            arguments : process.argv,
            directory : process.cwd(),
            so: process.platform,
            nodeVersion: process.version,
            totalMemory: process.memoryUsage().rss,
            processId : process.pid,
            cantidadDeCPUs: os.cpus().length,
        }
        res.json(dataProcess)
    } catch (error) {
        logger.error('Se produjo un error:' + error.message)
        loggerError.error('Se produjo un error:' + error.message)
        res.send("Error")
    }
})


rutas.get('/api/randoms', (req, res) => {
    try {
        logger.info('Se ejecutó el api ramdoms')
        const cantidad = req.query.cantidad || 100000000 // Cien millones si no se aclara

        const forked = fork('procesoSecundario.js', [cantidad], {
            cwd: process.cwd()
        })
        forked.on("message", respuesta => res.json({
            respuesta,
            pid: process.pid
        }))
        res.render('register')
    } catch (error) {
        logger.error('Se produjo un error:' + error.message)
        res.send("Error")
    }
})


/**
 * Rutas para autenticar
 */

rutas.post('/login', passport.authenticate('login', {failureRedirect: '/ecommerce/error'}), (req, res) => res.redirect('/ecommerce/'))

rutas.post('/register', passport.authenticate('signup', {failureRedirect: '/ecommerce/error'}), (req, res) => res.redirect('/ecommerce/login'))


export default rutas