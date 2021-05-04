const express = require('express');
const path = require('path');
const cons = require('consolidate');
const dust = require('dustjs-helpers');
app = express();
const { client } = require('./db/postgres.js');
const { send } = require('process');
const { dir } = require('console');


const port = process.env.PORT;

//paths
const viewPath = path.join(__dirname,'./templates/views');
const publicPath = path.join(__dirname, '../public');
const bootstrapPath = path.join(__dirname, '../node_modules/bootstrap/dist');
const jqueryPath = path.join(__dirname,'../node_modules/jquery/dist');


//assign dust engine to .dust files
app.engine('dust', cons.dust);

//set default extension .dust
app.set('view engine','dust');
app.set('views', viewPath);

//set public folder
app.use(express.static(publicPath));
app.use('/bootstrap', express.static(bootstrapPath));
app.use('/jquery', express.static(jqueryPath));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', async(req, res) => {
    try{
        await client.connect();
        const data = await client.query('select * from recipes');
        console.log(data.rows);
        res.render('index', {
            recipes: data.rows
        })
        client.end();
    }
    catch(err){
        res.status(400)
            .send(err);
    }
})

app.post('/add', async(req, res) => {
    const {name, ingredients, directions } = req.body;
    if(!name || !ingredients || !directions){
        alert('You cannot leave the fields empty');
        res.redirect('/');
    }
    try{
        await client.connect();
        await client.query('insert into recipes(name, ingredients, directions) values($1, $2, $3)',[name, ingredients, directions]);
        
        client.end();
        res.redirect('/');
    }
    catch(err){
        res.status(400)
            .send(err);
    }
})

//server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})