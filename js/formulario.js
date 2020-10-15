
eventListeners();

function eventListeners() {
        document.querySelector('#formulario').addEventListener('submit', validarRegistro); 
}

function validarRegistro(event) {
    event.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;
        //el #tipo va a ser crear o login, según la pag en la que este

    // si los campos están vacios manda alerta de error
    if (usuario === "" || password === ""){
        Swal({
            type: 'error',
            title: 'Error!',
            text: 'Ambos campos son obligatorios'
          })
    // si los campos están ok, uso ajax para conectar JS con la DB de PHP y poder
    // enviar los datos. Lo 1ro es estructurar los datos que se van a mandar en
    // un FormData, luego que la info esté acomodada llamo ajax.
    }else{
       var datos = new FormData();
       datos.append('usuario', usuario);
       datos.append('password', password);
       datos.append('accion', tipo);    

       //llamo a ajax
       var xhr = new XMLHttpRequest();
       //abro conexion
       xhr.open('POST', 'inc/modelos/modelo-admin.php', true);
       //retorno de datos
       xhr.onload = function() {
           if(this.status === 200) {
               //responseText es la respuesta del servidor con lo que este en el path
               //que puse arriba de modelo-admin. Osea, retorna la info de ese path. Y
               //se agrega el JSON.parse para que el string sea convertido en objeto
               var respuesta = JSON.parse(xhr.responseText);
               console.log(respuesta);
               if (respuesta.respuesta === 'correcto'){
                   if (respuesta.tipo === 'crear'){
                       Swal({
                           title: 'Usuario creado',
                           text: 'El usuario se creo correctamente',
                           type: 'success'
                       });
                   } else if (respuesta.tipo === 'login'){
                        Swal({
                            title: 'Login creado',
                            text: 'Press ok',
                            type: 'success'
                        })
                        .then(resultado =>{
                            if(resultado.value) {
                                window.location.href = "index.php";
                            }
                        })
                    }
               }else {
                   //Hubo un error del sistema
                   Swal({
                       title: 'Error inesperado',
                       text: 'Intente nuevamente',
                       type: 'error'
                   });
               }
           }
       }

       xhr.send(datos);
    }
}
   