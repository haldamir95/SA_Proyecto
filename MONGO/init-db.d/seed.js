
db.createCollection('vehiculo')
db.vehiculo.insertMany([
  {
    id: 0,
    estado: 3,
    tipo: 0,
    marca: 'Datsun',
    linea: '280Z',
    modelo: '1978',
    placa: 'P123QWE',
    color: 'negro',
    arranca: true,
    camina: true,
    falla_mecanica: false,
    garantia_inspeccion: false,
    inundado: false,
    colision: true,
    imagen: 'img/280Z.jpg',
    afiliado_adjudicado: 0,
    valor_adjudicacion: 120000.00
  },
  {
    id: 1,
    estado: 3,
    tipo: 0,
    marca: 'Roll Royce',
    linea: 'Phantom',
    modelo: '2018',
    placa: 'P456ASD',
    color: 'vino',
    arranca: true,
    camina: true,
    falla_mecanica: false,
    garantia_inspeccion: false,
    inundado: false,
    colision: true,
    imagen: 'img/RRP.jpg',
    afiliado_adjudicado: 0,
    valor_adjudicacion: 1000000.00
  },
  {
    id:2,
    estado: 3,
    tipo: 0,
    marca: 'Ford',
    linea: 'Raptor',
    modelo: '2018',
    placa: 'P789ZXC',
    color: 'Naranja',
    arranca: true,
    camina: true,
    falla_mecanica: false,
    garantia_inspeccion: false,
    inundado: false,
    colision: true,
    imagen: 'img/FR6x6.jpg',
    afiliado_adjudicado: 0,
    valor_adjudicacion: 800000.00
  },
  {
    id: 4,
    estado: 3,
    tipo: 0,
    marca: 'Honda',
    linea: 'S2000',
    modelo: '2000',
    placa: 'P741QAZ',
    color: 'Rojo',
    arranca: true,
    camina: true,
    falla_mecanica: false,
    garantia_inspeccion: false,
    inundado: false,
    colision: true,
    imagen: 'img/HS2000.jpg',
    afiliado_adjudicado: 0,
    valor_adjudicacion: 70000.00
  },
  {
    id: 5,
    estado: 3,
    tipo: 0,
    marca: 'Toyota',
    linea: 'MR2',
    modelo: '1986',
    placa: 'P852WSX',
    color: 'Silver',
    arranca: true,
    camina: true,
    falla_mecanica: false,
    garantia_inspeccion: false,
    inundado: false,
    colision: true,
    imagen: 'img/TMR2.jpg',
    afiliado_adjudicado: 0,
    valor_adjudicacion: 60000.00
  },
  {
    id: 6,
    estado: 3,
    tipo: 0,
    marca: 'Nissan',
    linea: 'Pulsar NX',
    modelo: '1978',
    placa: 'P666XXX',
    color: 'Black',
    arranca: true,
    camina: true,
    falla_mecanica: false,
    garantia_inspeccion: false,
    inundado: false,
    colision: true,
    imagen: 'img/NPNX.jpg',
    afiliado_adjudicado: 0,
    valor_adjudicacion: 20000.00
  }
])





db.createCollection('usuario')
db.usuario.insertMany([
  {
    id: 1,
    codigo: 666,
    password: '123',
    nombre: 'Alan Guzman'
  }
])
