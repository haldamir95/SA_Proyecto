const express = require('express');
const request = require('request');
const router = express.Router();
const fetchQuery = require('../request-manager');
const URL_OFICINA = 'http://127.0.0.1:4000'
const URL_ASEGURADORA = 'http://127.0.0.1:4000'      //        'http://34.214.230.10:4000'
const URL_TOKEN = 'http://3.94.79.29:8000'
const app = express();



router.get('/', (req,res) => {
    //Obteniendo Token
    var body = {
        client_id: 'giovannilopez', 
        client_secret: 'miacceso123'
    }
    var token = await fetchQuery(URL_TOKEN+'/getToken/','POST', body).then()
    .catch(function(err){
        console.log(err.status, err.statusText)
    });

    fetchQuery(URL_ASEGURADORA+'/Vehiculo', 'GET').then(res_be => {
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


router.get('/logear', (req,res) => {
  res.render('login.html',{ title: 'Subasta Online', message: ''});
});


router.get('/logout', (req,res) => {
  req.session.sessUsr='';
  fetchQuery(URL_ASEGURADORA+'/Vehiculo', 'GET').then(res_be => {
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

 
router.post('/Vehiculoput', async (req,res) => {
  var monto = req.body.tipo == 'C' ? 1000 : 500;
  var data = {
    jwt: req.body.jwt,
    id: req.body.id,
    estado: 3,
    afiliado_adjudicado: req.session.sessUsr,
    valor_adjudicacion: monto
  }
  console.log(data)
  var actualizacion = await fetchQuery(URL_OFICINA+'/Vehiculo', 'PUT', data).then()
  .catch(function (err) {
      console.log(err.status, err.statusText)
      res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:res_be, usr:req.session.sessUsr});
    }); 

  var vehiculos = await fetchQuery(URL_ASEGURADORA+'/Vehiculo', 'GET').then()
  .catch(function (err) {
    console.log(err.status, err.statusText)
    res.render('login.html',{ title: 'Subasta Online', message: err.status + ' ' + err.statusText});
  });

  if(actualizacion){
    res.render('./tech-blog/subasta.html',{ title: 'Subasta Online', carros:vehiculos, usr:req.session.sessUsr});
  }
});




//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
	
router.get('/Afiliado', async (req,res) => {
  req.session.sessUsr='';
  console.log(req.query)
  var usuario = await fetchQuery(URL_OFICINA+'/Afiliado?jwt='+req.query.jwt+'&codigo='+req.query.codigo+'&password='+req.query.password, 'GET').then()
  .catch(function (err) {
    console.log(err.status, err.statusText)
    res.render('login.html',{ title: 'Subasta Online', message: err.status + ' ' + err.statusText});
  });

  var vehiculos = await fetchQuery(URL_ASEGURADORA+'/Vehiculo', 'GET').then()
  .catch(function (err) {
    console.log(err.status, err.statusText)
    res.render('login.html',{ title: 'Subasta Online', message: err.status + ' ' + err.statusText});
  });

  if(usuario!=null){
    if (usuario.status=='OK') {
      if(usuario.vigente){
        req.session.sessUsr = usuario.codigo
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






/*
------------------------------------------------------------------------------------ 1  Afiliado GET para hacer login
// Afiliado							
// 	Tipo de request						
// 		GET					
// 	Parámetros						
// 		jwt	      string	requerido	Token de autenticación		
// 		codigo	  string	requerido	Código del afiliado		
// 		password	string	requerido	Password del afiliado		
// 	Respuesta						
// 		Afiliado					
// 			codigo	string			
// 			nombre	string			
// 			vigente	boolean			
// 	Código de éxito						
// 		200	OK				
// 	Excepciones						
// 		404	Not found	Si el código de afiliado no existe			
// 		401	Unauthorized	Si la autenticación no es exitosa			
// 		403	Forbidden	El JWT no es válido o no contiene el scope de este servicio	





------------------------------------------------------------------------------------2. Afiliado POST para registrar
------------------------------------------------------------------------------------3. Afiliado PUT para Actualizar

------------------------------------------------------------------------------------1. Pago GET para obtener utlimo pago 
------------------------------------------------------------------------------------2. Pago POST para hacer un pago

------------------------------------------------------------------------------------1. Vehiculo GET obtener los carros
Vehiculo							
	Tipo de request						
		GET					
	Parámetros						
		jwt	        string	requerido	Token de autenticación		
		id	        int	opcional	Id del vehículo		
		placa	      string	opcional	Placa		
		subastable	boolean	opcional	Si solo se quiere buscar subastables		
	Salida						
		Arreglo de Vehículo					
			id	int			
			estado	int			
			tipo	string			
			marca	string			
			linea	string			
			modelo	string			
			placa	string			
			color	string			
			arranca	boolean			
			camina	boolean			
			falla_mecanica	boolean			
			garantia_inspeccion	boolean			
			inundado	boolean			
			colision	boolean			
	Código de éxito						
		200	OK				
	Excepciones						
		404	Not found	Si el id no existe			
		403	Forbidden	El JWT no es válido o no contiene el scope de este servicio			
------------------------------------------------------------------------------------2. Foto GET para obtener fotos
------------------------------------------------------------------------------------3. Estado GET ???????
------------------------------------------------------------------------------------4. Vehiculo PUT para actualizar







------------------------------------------------------------------------------------1. TOKEN
router.post('/Token', async (req,res) => {
// URL: http://3.94.79.29:8000/getToken/
// client_id: giovannilopez
// client_secret: miacceso123
//http://3.94.79.29:8000/getToken/?client_id=giovannilopez?password=miacceso123
//Tambien pueden entrar al admin: 
// http://3.94.79.29:8000/admin/
//Para poder explorar el JWT lo pueden hacer a traves de:
//https://www.jsonwebtoken.io/      Con la llave: SA@2020
  var body = {
    client_id: 'giovannilopez', 
    client_secret: 'miacceso123'
  }
  var token = await fetchQuery(URL_TOKEN+'/getToken/','POST', body).then()
  .catch(function(err){
    console.log(err.status, err.statusText)
  });
    console.log(token)
});






*/









module.exports = router;
