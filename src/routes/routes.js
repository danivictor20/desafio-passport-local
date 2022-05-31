import { Router } from 'express'
import passport from "passport";
const rutas = Router()

/**
 * Rutas get para renderizar las vistas
 */
rutas.get('/', (req, res) => res.render('productos'))

rutas.get('/login', (req, res) => res.render('login'))

rutas.get('/register', (req, res) => res.render('register'))

rutas.get('/error-de-login', (req, res) => res.render('error-login'))

rutas.get('/logout', (req, res) => {

    res.redirect('/ecommerce/login')
})


/**
 * Rutas para autenticar
 */

rutas.post('/login', passport.authenticate('login', {failureRedirect: '/ecommerce/error-de-login'}), (req, res) => res.redirect('/ecommerce/'))

rutas.post('/register', passport.authenticate('signup', {failureRedirect: '/ecommerce/error-de-login'}), (req, res) => res.redirect('/ecommerce/login'))


export default rutas