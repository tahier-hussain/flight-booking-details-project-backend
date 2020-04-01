const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('config');
const app = express();

//Body Parser
app.use(bodyParser.json());

const db = config.get('mongoURI');

//Connect to MongoDB
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//Use Routes
app.use('/api/register', require('./routes/api/register'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/search', require('./routes/api/search'));

const port = 5000;

app.listen(port, () => console.log(`Server started at port ${port}`));