/* ---------------------------------      TABLA DE ROUTEO      -------------------------------------------------

                    URL_OFICINA                         URL_ASEGURADORA                     URL_TOKENS                          URL_ESB

LOCAL               http://127.0.0.1:4000               http://127.0.0.1:4000

GP2                 http://35.188.222.224               http://104.197.0.247                http://3.94.79.29:8000              http://54.173.141.98:8001

FISH GP4            http://35.232.205.249               http://34.70.210.93                                                     http://104.154.165.81

RICARDO


const credenciales2 = {
        client_id: 'fish', 
        client_secret: '201314646',
        grant_type: 'client_credentials',
        audience: 12
    }


    const credenciales = {
    client_id: 'giovannilopez', 
    client_secret: 'miacceso123',
    grant_type: 'client_credentials',
    audience: 12
}


*/


const express = require('express');
const router = express.Router();
const fetchQuery = require('../request-manager');

/*const URL_OFICINA = 'http://35.188.222.224'                 
const URL_ASEGURADORA = 'http://104.197.0.247'         
const URL_TOKEN = 'http://3.94.79.29:8000'
*/

const URL_OFICINA = 'http://54.173.141.98:8001'                 
const URL_ASEGURADORA = 'http://54.173.141.98:8001'         
const URL_TOKEN = 'http://3.94.79.29:8000'

const app = express();
const alert = require('alert-node')

const credenciales = {
    client_id: 'giovannilopez', 
    client_secret: 'miacceso123',
    grant_type: 'client_credentials',
    audience: 12
}


//------------------------------------------ INICIAL
router.get('/', async (req,res) => {
     //Obteniendo Token de Fotos
     var token = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
     .catch(function(err){
         console.log(err.status, err.statusText)
     });

     //Obteniendo Fotos
     var fotos = await fetchQuery(URL_ASEGURADORA+'/Foto?jwt='+token.token,'GET').then()
     .catch(function(err){
         console.log(err.status, err.statusText)
     });//, album:fotos.response
     //console.log(fotos)

     //Obteniendo Token de Vehiculos
    var token2 = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });

  
     //Obteniendo Todos los vehiculos
     fetchQuery(URL_ASEGURADORA+'/Vehiculo?jwt='+token2.token, 'GET').then(res_be => {
         if (res_be!=null) {
             //console.log(res_be)
             res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:res_be.response, usr:req.session.sessUsr, album:fotos.response});
         } else {
             console.log('res_back_end not soccess')
         }
     }).catch(function (err) {
         console.log('ERROR ', err.status, err.statusText)
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
    res.render('perfil.html',{ title: 'Subasta Online', nombre: req.session.sessAuth.local.nombre, user: req.session.sessAuth, message: ''});
});
//--------------------------------------------------------------------------





//-------------------------------------------- REGISTRARSE
router.get('/signup', (req,res) => {
    res.render('signup.html',{ title: 'Subasta Online', message: ''});
});
//--------------------------------------------------------------------------





//-------------------------------------------- DESLOGEARSE
router.get('/logout', async (req,res) => {
    //Terminando Sesion
    req.session.sessUsr='';
    req.session.sessCod='';
    req.session.sessVig=false;
    req.session.sessAuth={};


    //Obteniendo Token de Fotos
    var token = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });


    //Obteniendo Fotos de Vehiculos
    var fotos = await fetchQuery(URL_ASEGURADORA+'/Foto?jwt='+token.token,'GET').then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });//, album:fotos.response


    //Obteniendo Token 
    var token2 = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });


    //Obteniendo Todos los vehiculos
    fetchQuery(URL_ASEGURADORA+'/Vehiculo?jwt='+token2.token, 'GET').then(res_be => {
        if (res_be!=null) {
            res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:res_be.response, usr:req.session.sessUsr, album:fotos.response});
        } else {
            console.log('res_back_end not soccess')
        }
    }).catch(function (err) {
        console.log(err.status, err.statusText)
        res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:res_be.response, usr:req.session.sessUsr, album:fotos.response});
    }); 
});
//-------------------------------------------------------------------------------------------------------------------------




//---------------------------------------------------------- CREAR CUENTA
router.post('/Afiliadopost', async (req,res) => {
    //Obteniendo Token 
    var token = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });


    //Generando Body para hacer post
    var data = {
        jwt: token.token,
        nombre: req.body.email,
        password: req.body.password
    }

    //console.log("DATA",data)
    //Creando Usuario
    var usuario = await fetchQuery(URL_OFICINA+'/Afiliado', 'POST', data).then()
    .catch(function (err) {
        console.log(err.status, err.statusText)
        res.render('login.html',{ title: 'Subasta Online', message: err.status + ' ' + err.statusText + ' ' + err.message});
    });
    //console.log("USUARIO CREADO", usuario)


    //Validacion de respuestas
    if(usuario!=null){


        //Obteniendo Token de Pago
        var tokenPago = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
        .catch(function(err){
            console.log(err.status, err.statusText)
        });


        //Obteniendo pagos
        var pagos = await fetchQuery(URL_OFICINA+'/Pago?jwt='+tokenPago.token+'&codigo='+usuario.codigo,'GET').then().catch(function(err){
            console.log("Pagos ",err.status, err.statusText)
        });


        var idpago ='';
        var montopago='';
        var fechapago='';
        if(pagos!=null){
            idpago = pagos.id;
            montopago = pagos.monto;
            fechapago = pagos.fecha;
        }

        req.session.sessUsr = usuario.nombre;
        req.session.sessCod = usuario.codigo;
        req.session.sessVig = usuario.vigente;
        req.session.sessAuth = {
            local: {
                codigo: usuario.codigo,
                nombre: usuario.nombre,
                vigente: usuario.vigente
            },
            pago: {
                id: idpago,
                monto: montopago,
                fecha: fechapago
            },
            twitter: {
                id: usuario.codigo,
                display_name: usuario.nombre,
                username: '@'+usuario.nombre
            },
            google: {
                id: usuario.codigo,
                email: usuario.nombre+'@gmail.com',
                name: usuario.nombre
            }
        }
        

        //Enviando a subasta
        res.render('perfil.html',{ title: 'Subasta Online', nombre: req.session.sessAuth.local.nombre, user: req.session.sessAuth, message: ''});
    }
});




//---------------------------------------------------------- MODIFICAR CUENTA
router.post('/Afiliadoput', async (req,res) => {
    //Obteniendo Token 
    var token = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });


    //Generando Body para hacer put
    var data = {
        jwt: token.token,
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        password: req.body.password
    }


    //Modificando Usuario
    var usuario = await fetchQuery(URL_OFICINA+'/Afiliado', 'PUT', data).then()
    .catch(function (err) {
        console.log(err.status, err.statusText)
        res.render('perfil.html',{ title: 'Subasta Online', nombre: req.session.sessAuth.local.nombre, user: req.session.sessAuth, message: err.status + ' ' + err.statusText});
    });

    //Validacion de respuestas
    if(usuario!=null){
        //Obteniendo Token de Pago
        var tokenPago = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
        .catch(function(err){
            console.log(err.status, err.statusText)
        });


        //Obteniendo pagos
        var pagos = await fetchQuery(URL_OFICINA+'/Pago?jwt='+tokenPago.token+'&codigo='+usuario.codigo,'GET').then()
        .catch(function(err){
            console.log("Pagos ",err.status, err.statusText)
        });


        var idpago ='';
        var montopago='';
        var fechapago='';
        if(pagos!=null){
            idpago = pagos.id;
            montopago = pagos.monto;
            fechapago = pagos.fecha;
        }

        req.session.sessUsr = usuario.nombre
        req.session.sessCod = usuario.codigo
        req.session.sessVig = usuario.vigente;
        req.session.sessAuth = {
            local: {
                codigo: usuario.codigo,
                nombre: usuario.nombre,
                vigente: usuario.vigente
            },
            pago: {
                id: idpago,
                monto: montopago,
                fecha: fechapago
            },
            twitter: {   
                id: usuario.codigo,
                display_name: usuario.nombre,
                username: '@'+usuario.nombre
            },
            google: {
                id: usuario.codigo,
                email: usuario.nombre+'@gmail.com',
                name: usuario.nombre
            }
        }
        

        //Enviando a subasta
        res.render('perfil.html',{ title: 'Subasta Online', nombre: req.session.sessAuth.local.nombre, user: req.session.sessAuth, message:"Modificacion Exitosa"});
    
    }
});





//---------------------------------------------------------- LOGEAR
router.get('/Afiliado', async (req,res) => {

    //Terminando Sesion
    req.session.sessUsr='';
    req.session.sessCod='';
    req.session.sessVig=false;
    req.session.sessAuth={};


    //Obteniendo Token 
    var token = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });


    //Solicitando Usuario
    var usuario = await fetchQuery(URL_OFICINA+'/Afiliado?jwt='+token.token+'&codigo='+req.query.codigo+'&password='+req.query.password, 'GET').then()
    .catch(function (err) {
        console.log(err.status, err.statusText)
        res.render('login.html',{ title: 'Subasta Online', message: err.status + ' ' + err.statusText});
    });
    //console.log('USUARIO ',usuario)

    //Obteniendo Token 2 para Vehiculos
    var token2 = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });
  

    //Obteniendo Vehiculos
    var vehiculos = await fetchQuery(URL_ASEGURADORA+'/Vehiculo?jwt='+token2.token, 'GET').then()
    .catch(function (err) {
        console.log(err.status, err.statusText)
        res.render('login.html',{ title: 'Subasta Online', message: err.status + ' ' + err.statusText});
    });
  

    //Obteniendo Token 3 de Fotos
    var token3 = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });


    //Obteniendo Fotos de Vehiculos
    var fotos = await fetchQuery(URL_ASEGURADORA+'/Foto?jwt='+token3.token,'GET').then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });//, album:fotos.response


    //Obteniendo Token de Pago
    var tokenPago = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });


    //Obteniendo pagos
    var pagos = await fetchQuery(URL_OFICINA+'/Pago?jwt='+tokenPago.token+'&codigo='+usuario.codigo,'GET').then()
    .catch(function(err){
        console.log("Pagos ",err.status, err.statusText)
    });


    //Validacion de respuestas
    if(usuario!=null){
        var idpago ='';
        var montopago='';
        var fechapago='';
        if(pagos!=null){
            idpago = pagos.id;
            montopago = pagos.monto;
            fechapago = pagos.fecha;
        }

        req.session.sessUsr = usuario.nombre;
        req.session.sessCod = usuario.codigo;
        req.session.sessVig = usuario.vigente;
        req.session.sessAuth = {
            local: {
                codigo: usuario.codigo,
                nombre: usuario.nombre,
                vigente: usuario.vigente
            },
            pago: {
                id: idpago,
                monto: montopago,
                fecha: fechapago
            },
            twitter: {
                id: usuario.codigo,
                display_name: usuario.nombre,
                username: '@'+usuario.nombre
            },
            google: {
                id: usuario.codigo,
                email: usuario.nombre+'@gmail.com',
                name: usuario.nombre
            }
        }
        res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:vehiculos.response, usr:req.session.sessUsr, album:fotos.response});
        // }else{
        // res.render('login.html',{ title: 'Subasta Online', message: 'Su usuario NO esta vigente'});
        // }
    }
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------------





//------------------------------------------------------------------ HACER PUJA
router.post('/Vehiculoput', async (req,res) => {
    //VALIDAR SI ESTA VIGENTE YLOGEADO
    if(req.session.sessVig==true || req.session.sessVig.toString().toLowerCase() =="true"){
        //Obteniendo Token 3 de Fotos
        var token3 = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
        .catch(function(err){
            console.log(err.status, err.statusText)
        });


        //Obteniendo Fotos de Vehiculos
        var fotos = await fetchQuery(URL_ASEGURADORA+'/Foto?jwt='+token3.token,'GET').then()
        .catch(function(err){
            console.log(err.status, err.statusText)
        });//, album:fotos.response


        //Obteniendo Token
        var token = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
        .catch(function(err){
            console.log(err.status, err.statusText)
        });

        //Generando Body para hacer push
        var monto = req.body.tipo == 'C' ? 1000 : 500;
        var estadito = 3;
        var posible = Number(req.body.base) + Number(monto);
        if(Number(posible)>=Number(req.body.minimo)){
            estadito = 4;
        }

        var data = {
            jwt: token.token,
            id: Number(req.body.id),
            estado: estadito,
            afiliado_adjudicado: Number(req.session.sessCod),
            valor_adjudicacion: monto
        }
        //console.log(data)

        //Haciendo actualizacion
        var actualizacion = await fetchQuery(URL_OFICINA+'/Vehiculo', 'PUT', data).then()
        .catch(function (err) {
            console.log(err.status, err.statusText, err.response)
            //res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:res_be.response, usr:req.session.sessUsr, album:fotos.response});
        }); 
    

        //Obteniendo Token 2
        var token2 = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
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
            res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:vehiculos.response, usr:req.session.sessUsr, album:fotos.response});
        }
    }else{
        alert('No estas vigente para poder hacer pujas')
    }


    
});
    




//--------------------------------------------------------------- HACER PAGO
router.post('/Pago', async (req,res) => {
    console.log("ENTRO PAGO")
    //Obteniendo Token de Pago
    var tokenPago = await fetchQuery(URL_TOKEN+'/oauth/token/','POST', credenciales).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });


    //Data para pago
    var data = {
        jwt: tokenPago.token,
        codigo:  Number(req.body.codigo),
        monto:  Number(req.body.montoNuevo)
    }
    console.log(data)
    //Obteniendo pagos
    var pagos = await fetchQuery(URL_OFICINA+'/Pago','POST', data).then()
    .catch(function(err){
        console.log("error", err.status, err.statusText)
        alert("ERROR: " + err.status + " " + err.statusText)
        res.render('perfil.html',{ title: 'Subasta Online', nombre: req.session.sessAuth.local.nombre, user: req.session.sessAuth, message: "ERROR: " + err.status + " " + err.statusText});
    });

    if(pagos!=null){
        req.session.sessVig = true;
        req.session.sessAuth.pago.id = pagos.id;
        req.session.sessAuth.pago.monto = pagos.monto;
        req.session.sessAuth.pago.fecha = pagos.fecha;
        req.session.sessAuth.local.vigente = true;
        res.render('perfil.html',{ title: 'Subasta Online', nombre: req.session.sessAuth.local.nombre, user: req.session.sessAuth, message: ''});
        
    }
})
//-----------------------------------------------------------------------------------------------------------------------------------



module.exports = router;
