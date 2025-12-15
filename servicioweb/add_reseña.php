<?php 

header("Content-Type: application/json");

$dsn = 'mysql:dbname=ecomerce;host=127.0.0.1';
$usuario = 'root';
$clave = '';

$CODE = $_POST['code'] ?? '';
$COMENTARIO = $_POST['comentario'] ?? '';
$IMAGEN = $_POST['reseña'] ?? '';

$cn = new PDO($dsn, $usuario, $clave);
$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$sql = "CALL ADD_RESEÑA(?)";
$rs = $cn->prepare($sql);
$rs->execute([$CODE , $COMENTARIO , $IMAGEN]);

$resultado = $rs->fetch(PDO::FETCH_ASSOC);

?>