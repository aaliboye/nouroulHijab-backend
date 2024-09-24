var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var produitRouter = require('./routes/produit');
var roleRouter = require('./routes/role');
var ticketRouter = require('./routes/ticket')
const mongoose = require('mongoose')
const multer = require('multer');
const { log } = require('console');
const bodyParser = require('body-parser');

var app = express();

// const upload = multer({
//   limits: { fileSize: 10 * 1024 * 1024 * 1024} // Augmentez la taille selon vos besoins (ici, 10 Mo)
// });


const PATH = './uploads';
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
let upload = multer({
  storage: storage
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
})

app.use('/uploads', express.static('uploads'));

// Configurer body-parser pour augmenter la limite de taille de la requête
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.set("strictQuery", false);

// mongoose.connect(`mongodb+srv://aalijr97:${process.env.PASSWORD_DB}@cluster0.oepc2wf.mongodb.net/?retryWrites=true&w=majority`).then(()=>{
//   console.log('connexion DB reussi');
// })
// .catch((err)=>{
//   console.log(err);
//   console.log('connexion DB echoué');
// });

mongoose.connect('mongodb://127.0.0.1:27017/nouroulHijab').then(()=>{
  console.log('connexion DB reussi');
})
.catch((err)=>{
  console.log(err);
  console.log('connexion DB echoué');
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/category', categoryRouter);
app.use('/produits', produitRouter)
app.use('/role', roleRouter)
app.use('/tickets', ticketRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.post('/api/upload', upload.single('image'), function (req, res) {
  if (!req.file) {
    console.log("No file is available!");
    return res.send({
      success: false
    });
  } else {
    console.log('File is available!');
    return res.send({
      success: true
    })
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
