const express = require('express');
const app= express();
const path = require ('path');
const bodyParser = require('body-parser');

//settings
app.set('port',4000)
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs')
app.use(bodyParser());





//routes
app.use(require('./routes/routes.js'));

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
