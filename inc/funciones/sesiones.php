<?php

function usuario_autenticado () {
    if(!revisar_usuario() ){
        //si no hay usuario redirecciono al login
        header('Location:login.php');
        exit();
    }
}
function revisar_usuario() {
    return isset($_SESSION['nombre']);
    //la $_SESSION se crea en modelo-admin
}
session_start();
usuario_autenticado();