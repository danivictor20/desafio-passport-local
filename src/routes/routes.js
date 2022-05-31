import { Router } from 'express'
import passport from "passport";
const rutas = Router()

/**
 * Rutas get para renderizar las vistas
 */
rutas.get('/login', (req, res) => res.render('login'))

rutas.get('/register', (req, res) => res.render('register'))

rutas.get('/error-de-login', (req, res) => res.render('error-login'))

/**
 * Rutas para autenticar
 */

rutas.post('/login', passport.authenticate('login', {failureRedirect: '/error-de-login'}), (req, res) => {
    res.send('estamos bien')
})

rutas.post('/register', passport.authenticate('signup', {failureRedirect: '/error-de-login'}), (req, res) => {
    res.send('usuario creado')
})


export default rutas