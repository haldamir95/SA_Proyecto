const express = require('express');
const request = require('request');
const router = express.Router();
const fetchQuery = require('../request-manager');
const URL_OFICINA = 'http://127.0.0.1:4000'
const URL_ASEGURADORA = 'http://127.0.0.1:4000'      //        'http://34.214.230.10:4000'
const URL_TOKEN = 'http://3.94.79.29:8000'
const app = express();



//------------------------------------------ INICIAL
router.get('/', async (req,res) => {
    //Obteniendo Token
    var credenciales = {
        client_id: 'giovannilopez', 
        client_secret: 'miacceso123'
    }
    var token = await fetchQuery(URL_TOKEN+'/getToken/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });

    //Obteniendo Todos los vehiculos
    fetchQuery(URL_ASEGURADORA+'/Vehiculo?jwt='+token.token, 'GET').then(res_be => {
        if (res_be!=null) {
            res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:res_be, usr:req.session.sessUsr});
        } else {
            console.log('res_back_end not soccess')
        }
    }).catch(function (err) {
        console.log(err.status, err.statusText)
    }); 
});
//-----------------------------------------------------------------------------------------------------------------------





//-------------------------------------------- ENTRAR A LA PAGINA DE LOGIN
router.get('/logear', (req,res) => {
    res.render('login.html',{ title: 'Subasta Online', message: ''});
});
//--------------------------------------------------------------------------





//-------------------------------------------- PERFIL
router.get('/perfil', (req,res) => {
    res.render('perfil.html',{ title: 'Subasta Online', message: ''});
});
//--------------------------------------------------------------------------





//-------------------------------------------- REGISTRARSE
router.get('/signup', (req,res) => {
    res.render('signup.html',{ title: 'Subasta Online', message: ''});
});
//--------------------------------------------------------------------------





//-------------------------------------------- DESLOGEARSE
router.get('/logout', async (req,res) => {
    //Obteniendo Token
    var credenciales = {
        client_id: 'giovannilopez', 
        client_secret: 'miacceso123'
    }
    var token = await fetchQuery(URL_TOKEN+'/getToken/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });

    //Terminando Sesion
    req.session.sessUsr='';
    req.session.sessCod='';


    //Obteniendo Todos los vehiculos
    fetchQuery(URL_ASEGURADORA+'/Vehiculo?jwt='+token.token, 'GET').then(res_be => {
        if (res_be!=null) {
            res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:res_be, usr:req.session.sessUsr});
        } else {
            console.log('res_back_end not soccess')
        }
    }).catch(function (err) {
        console.log(err.status, err.statusText)
        res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:res_be, usr:req.session.sessUsr});
    }); 
});
//-------------------------------------------------------------------------------------------------------------------------




//---------------------------------------------------------- CREAR CUENTA
router.post('/Afiliadopost', async (req,res) => {
    //Obteniendo Token
    var credenciales = {
        client_id: 'giovannilopez', 
        client_secret: 'miacceso123'
    }
    var token = await fetchQuery(URL_TOKEN+'/getToken/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });


    //Generando Body para hacer post
    var data = {
        jwt: token.token,
        nombre: req.body.email,
        password: req.body.password
    }


    //Creando Usuario
    var usuario = await fetchQuery(URL_OFICINA+'/Afiliado', 'POST', data).then()
    .catch(function (err) {
        console.log(err.status, err.statusText)
        res.render('login.html',{ title: 'Subasta Online', message: err.status + ' ' + err.statusText});
    });


    //Validacion de respuestas
    if(usuario!=null){
        if(usuario.vigente){
            req.session.sessUsr = usuario.nombre
            req.session.sessCod = usuario.codigo
            
            
            //Obteniendo Token 2
            var token2 = await fetchQuery(URL_TOKEN+'/getToken/','POST', credenciales).then()
            .catch(function(err){
                console.log(err.status, err.statusText)
            });
        

            //Obteniendo Vehiculos
            var vehiculos = await fetchQuery(URL_ASEGURADORA+'/Vehiculo?jwt='+token2.token, 'GET').then()
            .catch(function (err) {
                console.log(err.status, err.statusText)
                res.render('login.html',{ title: 'Subasta Online', message: err.status + ' ' + err.statusText});
            });

            //Enviando a subasta
            res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:vehiculos, usr:req.session.sessUsr});
        }else{
            res.render('login.html',{ title: 'Subasta Online', message: 'Su usuario NO esta vigente'});
        }
    }
});





//---------------------------------------------------------- LOGEAR
router.get('/Afiliado', async (req,res) => {
    //Obteniendo Token
    var credenciales = {
        client_id: 'giovannilopez', 
        client_secret: 'miacceso123'
    }
    var token = await fetchQuery(URL_TOKEN+'/getToken/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });


    //Terminando Sesion
    req.session.sessUsr='';
    req.session.sessCod='';


    //Solicitando Usuario
    var usuario = await fetchQuery(URL_OFICINA+'/Afiliado?jwt='+token.token+'&codigo='+req.query.codigo+'&password='+req.query.password, 'GET').then()
    .catch(function (err) {
        console.log(err.status, err.statusText)
        res.render('login.html',{ title: 'Subasta Online', message: err.status + ' ' + err.statusText});
    });


    //Obteniendo Token 2
    var token2 = await fetchQuery(URL_TOKEN+'/getToken/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });
  

    //Obteniendo Vehiculos
    var vehiculos = await fetchQuery(URL_ASEGURADORA+'/Vehiculo?jwt='+token2.token, 'GET').then()
    .catch(function (err) {
        console.log(err.status, err.statusText)
        res.render('login.html',{ title: 'Subasta Online', message: err.status + ' ' + err.statusText});
    });
  

    //Validacion de respuestas
    if(usuario!=null){
        if (usuario.status=='OK') {
            if(usuario.vigente){
                req.session.sessUsr = usuario.nombre
                req.session.sessCod = usuario.codigo
                console.log('Afiliado -> ',usuario)
                res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:vehiculos, usr:req.session.sessUsr});
            }else{
            res.render('login.html',{ title: 'Subasta Online', message: 'Su usuario NO esta vigente'});
            }
        } else {
            console.log('res not success')
        } 
    }
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------------





//------------------------------------------------------------------ HACER PUJA
router.post('/Vehiculoput', async (req,res) => {
    //Obteniendo Token
    var credenciales = {
        client_id: 'giovannilopez', 
        client_secret: 'miacceso123'
    }
    var token = await fetchQuery(URL_TOKEN+'/getToken/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });


    //Generando Body para hacer push
    var monto = req.body.tipo == 'C' ? 1000 : 500;
    var data = {
        jwt: token.token,
        id: req.body.id,
        estado: 3,
        afiliado_adjudicado: req.session.sessCod,
        valor_adjudicacion: monto
    }
    

    //Haciendo actualizacion
    var actualizacion = await fetchQuery(URL_OFICINA+'/Vehiculo', 'PUT', data).then()
    .catch(function (err) {
        console.log(err.status, err.statusText)
        res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:res_be, usr:req.session.sessUsr});
    }); 
  

    //Obteniendo Token 2
    var token2 = await fetchQuery(URL_TOKEN+'/getToken/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });


    //Obteniendo Vehiculos
    var vehiculos = await fetchQuery(URL_ASEGURADORA+'/Vehiculo?jwt='+token2.token, 'GET').then()
    .catch(function (err) {
        console.log(err.status, err.statusText)
        res.render('login.html',{ title: 'Subasta Online', message: err.status + ' ' + err.statusText});
    });
  

    //Validando Actualizacion
    if(actualizacion){
        res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:vehiculos, usr:req.session.sessUsr});
    }
});
    





module.exports = router;