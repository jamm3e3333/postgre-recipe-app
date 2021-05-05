const express = require('express');
const path = require('path');
const hbs = require('hbs');
const { client } = require('./db/postgres.js');
app = express();
const port = process.env.PORT;

//paths
const viewPath = path.join(__dirname,'./templates/views');
const publicPath = path.join(__dirname, '../public');
const bootstrapPath = path.join(__dirname, '../node_modules/bootstrap/dist');
const partialsPath = path.join(__dirname, './templates/partials');

//set default extension .dust
app.set('view engine','hbs');
app.set('views', viewPath);
hbs.registerPartials(partialsPath);

//set public folder
app.use(express.static(publicPath));
app.use('/bootstrap', express.static(bootstrapPath));

app.use(express.json());

process.on('exit', () => {
    console.log('exit');
    client.end();
});

process.on('SIGINT', () => {
    console.log('SIGINT')
    client.end();
})

app.get('/', async(req, res) => {
    try{
        const data = await client.query('select * from recipes');
        if(!data.rows){
            res.status(400)
                .send("No data achieved.");
        }
        console.log(data);
        return res.render('index',{
            recipes: data.rows
        })
    }
    catch(e){
        console.log(e);
        return res.status(400)
            .send(e);
    }
})

app.post('/add', async(req, res) => {
    const {name, ingredients, directions } = req.body;
    if(!name || !ingredients || !directions){
        alert('You cannot leave the fields empty');
        res.redirect('/');
    } 
})

//server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})



