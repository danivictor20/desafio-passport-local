import { Router } from 'express'
import passport from "passport";
import { isAuth } from '../middlewares/authenticated.js'
import { listaProductos } from '../controllers/userController.js'
const rutas = Router()

import { fork } from "child_process";

/**
 * Rutas get para renderizar las vistas
 */
rutas.get('/', isAuth, listaProductos)

rutas.get('/login', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/ecommerce')
    res.render('login')
})

rutas.get('/register', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/ecommerce')
    res.render('register')
})

rutas.get('/error', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/ecommerce')
    res.render('error-login')
})

rutas.get('/logout', isAuth, (req, res) => {
    req.logout(err => {
        if (err) return err
        res.redirect('/ecommerce/login')
    })
})

rutas.get('/info', (req, res) => {
    const dataProcess = {
        arguments : process.argv,
        directory : process.cwd(),
        so: process.platform,
        nodeVersion: process.version,
        totalMemory: process.memoryUsage().rss,
        processId : process.pid,
    }
    res.json(dataProcess)
})


rutas.get('/api/randoms', (req, res) => {
    const cantidad = req.query.cantidad || 100000000 // Cien millones si no se aclara

    const forked = fork('procesoSecundario.js', [cantidad], {
        cwd: process.cwd()
    })
    forked.on("message", respuesta => res.send(respuesta))


})


/**
 * Rutas para autenticar
 */

rutas.post('/login', passport.authenticate('login', {failureRedirect: '/ecommerce/error'}), (req, res) => res.redirect('/ecommerce/'))

rutas.post('/register', passport.authenticate('signup', {failureRedirect: '/ecommerce/error'}), (req, res) => res.redirect('/ecommerce/login'))


export default rutas