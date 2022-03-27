// ****************************** DESAFIO ENTREGABLE ANTERIOR
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;
app.listen(PORT, err => {
    if (err) throw new Error(`Error en el servidor ${err}`)
    console.error(`El servidor express esta escuchando en el puerto ${PORT}`)
})

const { Router } = express;
const router = Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static(__dirname + '/public'))

const Container = require('./container.js')

const container = new Container();

//GET '/api/products' -> devuelve todos los products.
router.get('/',(req, res) => { res.json(container.getAll()) })

//GET '/api/products/:id' -> devuelve un producto según su id.
router.get('/:id',(req, res) =>{ res.json(container.getById(req.params.id)) })

//POST '/api/products' -> recibe y agrega un producto, y lo devuelve con su id asignado.
router.post('/', (req, res) =>{ res.json(container.save(req.body)) })

//PUT '/api/products/:id' -> recibe y actualiza un producto según su id.
router.put('/:id', (req, res) => { res.json(container.updateById(req.params.id, req.body));   })

//DELETE '/api/products/:id' -> elimina un producto según su id.
router.delete('/:id', (req, res) => {  res.json(container.deleteById(req.params.id))   })

app.use('/api/products', router);

// ****************************** DESAFIO ENTREGABLE 10

const handlebars = require('express-handlebars');
const hbs = handlebars.create({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',

    helpers: {
        isEmpity: function(products){   
            if(products.length===0){
                return "<tr> <td colspan='3'> Not products found </td> </tr>"
            }
        }
    }
});

app.engine('hbs', hbs.engine)

app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/products', (req, res) => {
    res.render('main', {products: container.getAll()});
})

app.post('/products', (req, res) => {
        container.save(req.body)
        res.redirect('/static');  
})

