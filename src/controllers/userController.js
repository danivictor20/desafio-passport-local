
import { logger } from '../utils/logger.js'
export const listaProductos = (req, res) => {
    try {
        logger.info('Se ejecutó el controlador')
        res.render('productos', {
            user: req.user
        })
    } catch (error) {
        logger.error('Se produjo un error:' + error.message)
        res.send("Error")
    }
}