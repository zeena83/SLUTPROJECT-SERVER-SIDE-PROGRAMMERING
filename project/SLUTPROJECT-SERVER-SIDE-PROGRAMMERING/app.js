var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var kvitto = require('./routes/kvitto');
var index = require('./routes/index');
var ansokning = require('./routes/ansokning')
var MongoClient = require('mongodb');
var nybokning = require('./routes/nybokning');
var ObjectId = require('mongodb').ObjectID;

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/ansokning', ansokning);
app.use('/kvitto', kvitto);
app.use('/nybokning', nybokning);

app.post('/process_post', function(req, res){
  console.log("hej" + req.body.fordonstyp)
  res.render('ansokning', {fordonstyp: req.body.fordonstyp, korkort: req.body.korkort, marke: req.body.marke, vaxellada: req.body.vaxellada, modell: req.body.modell, arsmodell: req.body.arsmodell, dagshyra: req.body.dagshyra, id: req.body.id})
  
})

app.post('/kvitto', function(req, res){
  console.log("hallo" + req.body.id)
    
    MongoClient.connect('mongodb://ECGrupp3:Frontend2016@cluster0-shard-00-00-dmlri.mongodb.net:27017,cluster0-shard-00-01-dmlri.mongodb.net:27017,cluster0-shard-00-02-dmlri.mongodb.net:27017/fordondb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin', function(err, db){
        if (err) throw err
        var ObjId = "ObjectId"+'("'+req.body.id+'")';
        console.log(ObjId);
    try {
        db.collection('fordon').update({"_id": ObjectId("59d28a7e687fe192b3ed98d0")},
                            {
            $set: {"bokad": "ja"}
        })
    }catch (e){
        console.log(e);
    }
    })
  res.render('kvitto', {id: req.body.id, email: req.body.email})
  
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
