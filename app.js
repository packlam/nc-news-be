const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db_url = require('./config/db_config');
const apiRouter = require('./routes/api');

// set up the web server
const app = express();
app.use(bodyParser.json())
app.use(express.static('public'));
app.set('view engine', 'ejs');

// connect to the database
mongoose.connect(db_url, { useNewUrlParser: true })
  .then(() => console.log(`Connected to database ${db_url}`))
  .catch(console.log)

// set up the routes
app.get('/', (req, res) => res.status(200).render('index'));
app.use('/api', apiRouter);

// error handling
app.use((err, req, res, next) => {
  if (['CastError', 'ValidationError'].includes(err.name)) res.status(400).send({msg: err.message})
  else res.status(err.status).send({msg: err.msg});
})

module.exports = app;