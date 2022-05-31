
export const listaProductos = (req, res) => {
    res.render('productos', {
        user: req.user
    })
}