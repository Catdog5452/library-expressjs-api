const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the application.' });
});

require('./app/routes/authors.routes.js')(app);
require('./app/routes/books.routes.js')(app);

module.exports = app;