<?php

$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];

if($accion === 'crear'){

    include 'C:\xampp\htdocs\uptask-inicio\inc\funciones\conexion.php';

    try{
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?) ");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();
        if($stmt->affected_rows) {
            $respuesta = array (
                'respuesta'=> 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre_proyecto' => $proyecto
            );
        }else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        
        $stmt->close();
        $conn->close();
    }catch(Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}
