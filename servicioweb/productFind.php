<?php

try {

    $dsn = 'mysql:dbname=ecomerce;host=127.0.0.1';
    $usuario = 'root';
    $clave = "";

    $cn = new PDO($dsn, $usuario, $clave);
    $cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $idProducto = $input["id"] ?? null;

    if (empty($idProducto)) {
        echo json_encode(["error" => "No se envió id"]);
        exit;
    }

    // ===== PRODUCTO =====
    $sql = "SELECT * FROM productos WHERE id = :productId LIMIT 1";
    $smts = $cn->prepare($sql);
    $smts->bindValue(":productId", $idProducto);
    $smts->execute();
    $rows = $smts->fetchAll(PDO::FETCH_ASSOC);

    if (empty($rows)) {
        echo json_encode(["error" => "Producto no encontrado"]);
        exit;
    }

    $productoRow = $rows[0];

    $sql2 = "SELECT images FROM producto_imgs WHERE product_id = :productId";
    $smts2 = $cn->prepare($sql2);
    $smts2->bindValue(":productId", $idProducto);
    $smts2->execute();
    $rows2 = $smts2->fetchAll(PDO::FETCH_ASSOC);


    $producto = [
        'id' => $productoRow['id'],
        'nombre' => $productoRow['nombre'],
        'descripcion' => $productoRow['descripcion'],
        'categoria_id' => $productoRow['categoria_id'],
        'precio' => $productoRow['precio'],
        'stock' => $productoRow["stock"],
        'imgs' => $rows2 
    ];

    echo json_encode($producto);

} catch (PDOException $e) {
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}

?>
