<?php

try {

    $dsn = 'mysql:dbname=ecomerce;host=127.0.0.1';
    $usuario = 'root';
    $clave = "";

    $cn = new PDO($dsn, $usuario, $clave);
    $cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    $searchQuery = $input["searchQuery"] ?? ''; 
    $pageSize = isset($input["pageSize"]) ? (int)$input["pageSize"] : 10;
    $page = isset($input["page"]) ? (int)$input["page"] : 1;
    $categoryId = $input["categoryId"] ?? null;
    $offset = ($page - 1) * $pageSize;
    $userId = $input["userId"];

    $sql = "
        SELECT 
            p.id,
            p.nombre,
            p.descripcion,
            p.precio,
            p.categoria_id,
            p.stock,
            cu.id_carrito,
            COUNT(*) AS cantidad
        FROM carrito_usuario cu
        LEFT JOIN productos p ON p.id = cu.id_producto
        WHERE cu.id_usuario = :userId
    ";

    if (!empty($searchQuery)) {
        $sql .= " AND p.nombre LIKE :searchQuery ";
    }

    if (!empty($categoryId)) {
        $sql .= " AND p.categoria_id = :categoryId ";
    }

    $sql .= "
        GROUP BY p.id
        ORDER BY p.id ASC
        LIMIT :pageSize OFFSET :offset
    ";


    $stmt = $cn->prepare($sql);

    $stmt->bindValue(':userId', (int)$userId, PDO::PARAM_INT);
    if (!empty($searchQuery)) $stmt->bindValue(":searchQuery" , "%$searchQuery%", PDO::PARAM_STR);
    if (!empty($categoryId)) $stmt->bindValue(":categoryId" , (int)$categoryId, PDO::PARAM_INT);
    $stmt->bindValue(':pageSize', (int)$pageSize, PDO::PARAM_INT);
    $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);

    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);


    $ids = array_column($rows, "id");

    if (count($ids) > 0) {
        $in = implode(",", array_fill(0, count($ids), "?"));
        $sql2 = "SELECT image_id, images, product_id FROM producto_imgs WHERE product_id IN ($in)";
        $stmt2 = $cn->prepare($sql2);
        $stmt2->execute($ids);
        $rows2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $rows2 = [];
    }


    $productos = [];

    foreach ($rows as $row) {
        $id = $row["id"];

        $productos[$id] = [
            'id' => $row['id'],
            'nombre' => $row['nombre'],
            'descripcion' => $row['descripcion'],
            'categoria_id' => $row['categoria_id'],
            'precio' => $row['precio'],
            'stock' => $row['stock'],
            'cantidad' => (int)$row['cantidad'],  
            "idCarrito" => $row["id_carrito"],
            'imgs' => []
        ];
    }

    foreach ($rows2 as $row2) {
        $idProduct = $row2["product_id"];

        if (isset($productos[$idProduct])) {
            $productos[$idProduct]["imgs"][] = [
                "id" => $row2["image_id"],
                "images" => $row2["images"]
            ];
        }
    }

    $productos = array_values($productos);


    echo json_encode([
        "status" => "success",
        "data" => $productos,
        "currentPage" => $page,
        "pageSize" => $pageSize
    ]);


} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>
