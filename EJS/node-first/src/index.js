const express = require('express');
const app= express();
const path = require ('path');
const bodyParser = require('body-parser');
const session = require('express-session');


//settings
app.set('port',3000)
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs')
app.use(bodyParser());
app.use(session({secret: 'sagp2', resave: true, saveUninitialized: true}));
app.use((req, res, next) => {
  // Check if we've already initialised a session
  if (!req.session.initialised) {
     // Initialise our variables on the session object (that's persisted across requests by the same user
     req.session.initialised = true;
     req.session.sessUsr = '';
     req.session.sessCod = '';
     req.session.sessAuth = {};
     req.session.sessVig = false;
  }
  next();
});


//routes
app.use(require('./routes/web.js'));

//static files 
app.use(express.static(path.join(__dirname, 'public')));
//listen
app.listen(app.get('port'), ()=>{
  console.log('#################################################################################################');  
  console.log('#################################################################################################');
  console.log('#################            Escuchando http://localhost:',app.get('port'),'         #######################');
  console.log('#################################################################################################');
  console.log('#################################################################################################');
});
