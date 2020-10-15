<?php 
    include 'inc/funciones/sesiones.php';
    include 'inc/funciones/funciones.php';
    include 'inc/templates/header.php'; 
    include 'inc/templates/barra.php'; 
    
    $id_proyecto = null;
    
    //obtengo el id de la URL
    if(isset($_GET ['id_proyecto'])) {
        $id_proyecto = $_GET['id_proyecto'];
    }  
?>

<div class="contenedor">
    
    <?php
        include 'inc/templates/sidebar.php';       
    ?>

    <main class="contenido-principal">
    
    <?php 
    
    $proyecto = obtenerNombreProyecto($id_proyecto);    
  
        if($proyecto): ?>

        <h1> Proyecto actual:
            <?php foreach ($proyecto as $nombre): ?>
                <span><?php echo $nombre ['nombre']; ?></span>
            <?php endforeach; ?>   
        </h1>

        <form action="#" class="agregar-tarea">
            <div class="campo">
                <label for="tarea">Tarea:</label>
                <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
            </div>
            <div class="campo enviar">
                <input type="hidden" id="id_proyecto" value ="<?php echo $id_proyecto; ?>">
                <input type="submit" class="boton nueva-tarea" value="Agregar">
            </div>
        </form>
        
    <?php
        else:
            $id_proyecto = 0;
            //si no hay proyectos
            echo "<p>Selecciona un proyecto a la izquierda </p>"; 

        endif;
    ?>
 

        <h2>Listado de tareas:</h2>

        <div class="listado-pendientes">
            <ul>

            <?php
            
                $tareas = obtenerTareasProyecto($id_proyecto);
                
                if($tareas->num_rows > 0){
                    foreach($tareas as $tarea): ?>
                        <li id="tarea:<?php echo $tarea['id'] ?>" class="tarea">
                        <p><?php echo $tarea['nombre'] ?></p>
                            <div class="acciones">
                                <!--le agrego un operador ternareo, un if en una sola linea: diciendo que si el estado es
                                igual a 1 agrego la clase completo sino (:) no agrego nada-->
                                <i class="far fa-check-circle <?php echo ($tarea['estado'] === '1' ? 'completo' : '')?>"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        </li>
            <?php endforeach ?>
            <?php             
                }else{
                    echo"<p class='lista-vacia'>No hay tareas en este proyecto</p>";
                }

            ?>   
            </ul>
        </div>
        <div class="avance">
                <h2>Avance del Proyecto:</h2>
                <div id="barra-avance" class="barra-avance">
                    <div id="porcentaje" class="porcentaje"></div>
                </div>
        
        </div>
    </main>
</div><!--.contenedor-->

<?php include 'inc/templates/footer.php'; ?>