<?php 

$dsn = 'mysql:dbname=ecomerce;host=127.0.0.1';
$usuario = 'root';
$clave = '';

    $cn = new PDO($dsn, $usuario, $clave);
//    Selecciona  todo  de  categorias
    $sql = "SELECT * FROM categorias";
    $rs = $cn->query($sql);

    $rows = $rs->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($rows, JSON_UNESCAPED_UNICODE);


    