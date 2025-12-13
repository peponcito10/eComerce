<?php 

$dsn = 'mysql:dbname=ecomerce;host=127.0.0.1';
$usuario = 'root';
$clave = "";

try {

    $cn = new PDO($dsn, $usuario, $clave);
    $cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    if (!isset($input["idCarrito"])) {
        throw new Exception("Falta el idCarrito");
    }

    $idCarrito = (int)$input["idCarrito"];

    $sql = "CALL eliminarProductoCarrito(?)";

        $stmt = $cn->prepare($sql);

    $stmt->execute([$idCarrito]);

    echo json_encode([
        "status" => "success",
        "message" => "Producto eliminado del carrito"
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>
