import { Router } from 'express'
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



export default rutas