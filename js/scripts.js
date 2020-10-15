
eventListeners();
//variable globales
var listaProyectos = document.querySelector('#proyectos');

function eventListeners() {

    //Document Ready
    document.addEventListener('DOMContentLoaded',function(){
        actualizarProgreso();
    })

    //boton de crear nuevo proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //boton para nueva tarea
    if(document.querySelector('.nueva-tarea') !== null ){
        document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
    }

    //botones para eliminar y editar las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto (event) {
    event.preventDefault();
    
    //Crea un input para el nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type=text id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    //creo variable con el id del nuevo proyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    //al presionar enter que se cree el proyecto. me fijo el numero which de la tecla enter en la consola
    inputNuevoProyecto.addEventListener('keypress', function(event){
        var tecla = event.which || event.keyCode;

        if(tecla === 13){
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');
            guardarProyectoDB(inputNuevoProyecto.value);
            //elimino lo creado el input del nuevo proyecto, xq ya se almaceno en la funcion guardarProyecto
            listaProyectos.removeChild(nuevoProyecto);
        }
    });

}

function guardarProyectoDB (nombreProyecto) {
   //Creo llamado a ajax
   var xhr = new XMLHttpRequest();
   //organizo la info a enviar en formdata
   var datos = new FormData();
   datos.append('proyecto', nombreProyecto);
   datos.append('accion', 'crear');

   xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);
   
   xhr.onload = function(){
    if(this.status === 200){
        var respuesta = JSON.parse(xhr.responseText);
        var proyecto = respuesta.nombre_proyecto,
            id_proyecto = respuesta.id_insertado,
            tipo = respuesta.tipo,
            resultado = respuesta.respuesta;
        
            //compruebo inserción
        if(resultado === 'correcto'){
            if(tipo === 'crear'){
            //se creo un nuevo proyecto
            // Inyecto el enlace del nuevo proyecto en la barra
            var nuevoProyecto = document.createElement('li');
            nuevoProyecto.innerHTML = `
                <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                    ${nombreProyecto}
                </a>
            `;
            //agrego al html
            listaProyectos.appendChild(nuevoProyecto);

            Swal({
                title: 'Proyecto creado',
                text: 'El proyecto: ' + proyecto + ' se creo correctamente',
                type: 'success'
            })
            .then(resultado =>{
                //redirecciono a la pagina del id del proyecto creado
                if(resultado.value) {
                    window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                }
            })
            
            
            } else {
            //se actualizo o elimino
            }

        } else{
            Swal({
                type: 'error',
                title: 'Error!',
                text: 'El proyecto no fue creado'
            })
        }

    }

   }
   xhr.send(datos);
}

function agregarTarea (e) {
    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    if(nombreTarea === ''){
        Swal({
            title: 'Error',
            text: 'Debe agregar una tarea',
            type: 'error'
        })
    } else {
        // mando la tarea a php e inserto en la DB
        var xhr = new XMLHttpRequest();
        var datos = new FormData();
            datos.append('tarea', nombreTarea),
            datos.append('accion', 'crear'),
            datos.append('id_proyecto', document.querySelector('#id_proyecto').value );

        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
        xhr.onload = function(){
            if(this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                // asigno valores a los datos que me devuelve el json
                var resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;

                if(resultado === 'correcto'){
                    //se agrego correctamente
                    if(tipo === 'crear'){
                        //las tareas se pueden crear, editar y eliminar. Empiezo con crear:
                        Swal ({
                            title: 'Perfecto!',
                            text: 'Su tarea: ' + tarea + ' se guardó con exito',
                            type: 'success'
                        });

                        //selecciono el parrafo con la .lista-vacia
                        var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        if(parrafoListaVacia.length > 0){
                            document.querySelector('.lista-vacia').remove();
                        }

                        //construir el template para insertar la tarea en el html 
                        var nuevaTarea = document.createElement('li');
                        //agrego la clase tarea que ya tiene estilos
                        nuevaTarea.classList.add('tarea');
                        //construyo el html con string literals
                        nuevaTarea.innerHTML=`
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;
                        //inserto en html
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);
                        //limpio el formulario, con el metodo de js para resetear el formulario
                        document.querySelector('.agregar-tarea').reset();

                        //ACTUALIZO la barra de progreso
                        actualizarProgreso();
                    }
                }else {
                    //hubo un error
                    Swal({
                        title: 'Error',
                        text: 'Hubo un error',
                        type: 'error'
                    })
                }
            }
        }
        xhr.send(datos);

       
    }
}

function accionesTareas(e){
    e.preventDefault();
    //aplicamos Delegation: va a tomar cualquier tipo de elemento en el cual demos click.
    if(e.target.classList.contains('fa-check-circle')){
        if(e.target.classList.contains('completo')){
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else{
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }
    if(e.target.classList.contains('fa-trash')){
        Swal.fire({
            title: 'Estas seguro(a)?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {

                var tareaEliminar = e.target.parentElement.parentElement;
              
              // borrar de la DB
                eliminarTareaBD(tareaEliminar);
              // borrar del html
                tareaEliminar.remove();

                Swal.fire(
                'Borrado!',
                'La tarea fue eliminada',
                'success'
              )
            }
          });
    }
}

function cambiarEstadoTarea(tarea, estado){
    //Traigo solo el ID de la tarea, por eso split.
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    //console.log(idTarea[1]);

    var xhr = new XMLHttpRequest();

    var datos = new FormData();
        datos.append('id', idTarea[1]);
        datos.append('accion', 'actualizar');
        datos.append('estado', estado);

    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    xhr.onload = function(){
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));
            actualizarProgreso();
        }
    }
    xhr.send(datos);
}

function eliminarTareaBD (tarea){
    var idTarea = tarea.id.split(':');

    var xhr = new XMLHttpRequest();
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');

    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    xhr.onload = function(){
        if(this.status === 200){
            console.log(JSON.parse(xhr.responseText));

            //comprobar que haya tareas restantes
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
                if(listaTareasRestantes.length === 0){
                    document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
                }
            //actualizo la barra de progreso
            actualizarProgreso();
        }
    }
    xhr.send(datos);
    
}

function actualizarProgreso(){
    //obtengo todas los li que tengan la clase tarea
    const tareas = document.querySelectorAll('li.tarea');

    //obtengo todas las tareas completadas, es decir todos los iconos con la clase completo
    const tareasCompletadas = document.querySelectorAll('i.completo');

    //determinar el avance
    const avance = Math.round((tareasCompletadas.length/tareas.length)*100);

    //asigno el avance a la barra del div
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%';

    if(avance === 100){
        Swal({
            title: 'Proyecto Terminado!!',
            text: 'Ya no tienes tareas pendientes',
            type: 'success'
        })
    }
}