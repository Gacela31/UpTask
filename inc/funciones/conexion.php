<?php

$conn = new mysqli('localhost','root','','uptask');

if($conn->connect_error){
    echo $conn->connect_error;
   }
   
   //que se impriman los acentos y las Ñ
   $conn->set_charset('utf8');