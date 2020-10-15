<?php

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if($accion === 'crear'){
    //codigo p/ crear los administradores

    //1ro le doy SEGURIDAD al Password
    $opciones = array(
        'cost'=> 12
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);

    include 'C:\xampp\htdocs\uptask-inicio\inc\funciones\conexion.php';

    try{
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();
        if($stmt->affected_rows) {
            $respuesta = array (
                'respuesta'=> 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
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

if($accion === 'login'){

    include 'C:\xampp\htdocs\uptask-inicio\inc\funciones\conexion.php';

    try{
        $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
        //inyecto la entrada del usuario en el placeholder de arriba '?'
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        //Logueamos el usuario con bind_result, función donde se va a retornar el usuario
        // id y passaword (especificado en el SELECT de arriba) del $usuario ingresado, por 
        //lo que creo las tres variables en el mismo orden
        $stmt->bind_result($nombre_usuario, $id_usuario, $password_usuario);
        $stmt->fetch();
        if($nombre_usuario){
            if(password_verify($password, $password_usuario)){
                //inicia session
                session_start();
                $_SESSION['nombre'] = $usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;
                //Login correcto
                $respuesta = array(
                    'respuesta'=>'correcto',
                    'nombre' => $nombre_usuario,
                    'tipo' => $accion
                );
            } else {
                $respuesta = array(
                    'resultado' => 'inok'
                );
            }
            
        }else {
            $respuesta = array (
                'error' => 'Usuario no existe'
            );

        }
        $stmt->close();
        $conn->close();

    }catch(Exception $e) {
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);

}

   

 
