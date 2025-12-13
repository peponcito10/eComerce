
<?php 

$dsn = 'mysql:dbname=ecomerce;host=127.0.0.1';
$usuario = 'root';
$clave = '';

$USER = $_POST['username_register'] ?? '';
$PASS = $_POST['password_register'] ?? '';

$cn = new PDO($dsn, $usuario, $clave);
$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$hash = password_hash($PASS , PASSWORD_DEFAULT);
$sql = "CALL USER_REGISTER(? , ?)";
$rs = $cn->prepare($sql);

$rs->execute([$USER , $hash]);

$resultado = $rs->fetch(PDO::FETCH_ASSOC);


if ($resultado["STATUS"] === "USER_EXIST") {
    echo json_encode([
        "ok" => false,
        "msg" => "El usuario ya existe",
        "status" => "USER_EXIST"
    ]);
    exit;
}

echo json_encode([
    "ok" => true,
    "msg" => "Registro exitoso",
    "status" => "SUCCESS",
    "data" => $resultado
]);

?>