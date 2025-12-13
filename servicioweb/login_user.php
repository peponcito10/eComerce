<?php 

header("Content-Type: application/json");

$dsn = 'mysql:dbname=ecomerce;host=127.0.0.1';
$usuario = 'root';
$clave = '';

$USER = $_POST['username_login'] ?? '';
$PASS = $_POST['password_login'] ?? '';

$cn = new PDO($dsn, $usuario, $clave);
$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$sql = "CALL USER_LOGIN(?)";
$rs = $cn->prepare($sql);
$rs->execute([$USER]);

$resultado = $rs->fetch(PDO::FETCH_ASSOC);

if (!$resultado || $resultado["STATUS"] === "NO_USER") {
    echo json_encode([
        "ok" => false,
        "msg" => "Usuario no encontrado",
     "status" =>  "USER_INVALID"  

    
    ]);
    exit;
}

if (!password_verify($PASS, $resultado["USER_PASSWORD"])) {
    echo json_encode([
        "ok" => false,
        "msg" => "Contraseña incorrecta",
     "status" =>  "PASSWORD_INVALID"  

    ]);
    exit;
}

// Login correcto
echo json_encode([
    "ok" => true,
    "msg" => "Inicio de sesión exitoso",
    "data" => $resultado,
    "status" =>  "SUCCESS"  

]);
