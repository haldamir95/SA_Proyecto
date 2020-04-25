# SubastaEnLinea
Pagina de Subasta Subasta en linea con NodeJs y Express

#Para Instalar las dependecias hay que poner en la terminal de Visual Studio Code
npm i express ejs morgan
#para poder usar fetch query
npm install node-fetch --save
#para auto recargar el server (correr con $ npm run dev
npm i -G nodemon 
#para poder parsear los JSON
npm i body-parser
#para poder usar variables de session
npm install express-session --save
#para enviar body en GET y POST
npm install request



#PASOS PARA HACER LA INSTALACION CONTINUA--------------------------------------------------
Crear la maquina virtual en Cloude
En mi terminal linux generar claves SSH
    $ ssh-keygen -m PEM -t rsa -C "haldamir.95@gmail.com" -f /home/haldamir/Documentos/llaves
Ir a la carpeta y copiar el contenido de la llave publica .pub
En el panel de compute Engine ir a Metadatos y en la pestania SSH pegar la llave publica

ir a el documento donde estan las llaves y abrirlo en la terminal
    $ ssh -i <nombre_llaves> <nombre SSH de metadatos>@<IP de la maquina virtual>    
    $ ssh -i llaves haldamir.95@34.69.242.48

Tener instalado Docker, agregar el usuario al grupo de docker
    $docker run hello-world

Con la maquina virtual en nuestra terminal, creamos el archivo deploy_app.sh
    Ejemplo del archivo a la par de esta guia

Crear Dockerfile del proyecto 
    
Crear la carpeta .circleci en la raiz del proyecto (a la par del .git) y adentro crear el archivo config.yml

Ir a CircleCI y agregar el proyecto
    1. Set Up proyect
    2. Start building
    3. Add manualy
    4. Start Building
    5. Project Settings -> SSH Key
    6. Add SSH Key y pegar la llave privada que creamos (abrir con nano) y el hostname el usuario de la nube
    7. Se genera un fingerprint para el siguiente paso

Modificar los fingerprints en el archivo .circleci/config.yml
    1. el fingerprint generado en circleci
    2. ir a Checkout SSH Keys en las configuraciones del proyecto y pegar el fingerprint del proyecto

un poco abajo de los fingerprints cambiar el imagen name
command: |
            echo 'export TAG=0.1.${CIRCLE_BUILD_NUM}' >> $BASH_ENV
            echo 'export IMAGE_NAME=nombre_de_la_imagen' >> $BASH_ENV

en la parte de hasta abajo del config.yml cambiar el nombre del usuario y del host ip en el acceso ssh -o 
   
Crear cuenta en Dockerhub

entrar a los settings del proyecto de CircleCI y seleccionar Environment Variables
Agregar variables
name: DOCKER_LOGIN      value: haldamir95
name: DOCKER_PWD        value: docker11235813
#FIN DE LA INSTALACION CONTINUA------------------------------------------------------------
















