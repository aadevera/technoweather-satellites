// Get all environmental variables
const { PORT = 10001, HOST = 'localhost' } = process.env;

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./src/routes');
// const interceptor = require('./src/middlewares/interceptor');

app.use(express.static('public'));

app.set('views', 'src/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.redirect('/home');
  // res.json({ message: 'Welcome to Root. Nothing to do here.' });
});

app.use('/home', (req, res) => {
  res.render('index', {});
});

app.use('/api', routes);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found.' });
});
// app.use(interceptor);

app.listen(PORT, HOST, () => {
  console.log(`Server listening to ${HOST}:${PORT}`);
});
