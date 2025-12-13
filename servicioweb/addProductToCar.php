<?php 

$dsn = 'mysql:dbname=ecomerce;host=127.0.0.1';
$usuario = 'root';
$clave = "";
    $cn = new PDO($dsn, $usuario, $clave);
    $cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $userId = $input["userId"];
    $productId = $input["productId"];

    $sql = "CALL agregarAlCarrito(? , ?)";
    $stmt = $cn->prepare($sql);
    
    $stmt->execute([$userId , $productId]);
    $rows = $stmt->fetchAll();

    echo json_encode($rows);
?>