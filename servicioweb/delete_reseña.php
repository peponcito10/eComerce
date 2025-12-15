<?php 

header("Content-Type: application/json");

$dsn = 'mysql:dbname=ecomerce;host=127.0.0.1';
$usuario = 'root';
$clave = '';

$ID = $_POST['id_reseña'] ?? '';


$cn = new PDO($dsn, $usuario, $clave);
$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$sql = "CALL DELETE_RESEÑA(?)";
$rs = $cn->prepare($sql);
$rs->execute($ID);

$resultado = $rs->fetch(PDO::FETCH_ASSOC);

?>