require('dotenv').config();
const express = require('express');
const app = express();
var http = require('http').Server(app);

const path = require('path');
const routes = require('./routes');

// Set the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/', routes);

http.listen(3000, function(){
    console.log('Server is running');
});
