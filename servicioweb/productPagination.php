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


    $sql = "SELECT * FROM productos WHERE 1=1";

    if(!empty($searchQuery)){
        $sql .= " AND productos.nombre LIKE :searchQuery";
    }


    if(!empty($categoryId)){
        $sql .= " AND productos.categoria_id = :categoryId";
    }

    $sql .= " ORDER BY productos.id ASC LIMIT :pageSize OFFSET :offset";

    $stmt = $cn->prepare($sql);
    if(!empty($searchQuery)) $stmt->bindValue(":searchQuery" , "%$searchQuery%", PDO::PARAM_STR);
    if(!empty($categoryId)) $stmt->bindValue("categoryId" , (int)$categoryId, PDO::PARAM_INT);
    $stmt->bindValue(':pageSize', (int)$pageSize, PDO::PARAM_INT);
    $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);

    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);




    $sql2 = "SELECT image_id , images , product_id FROM producto_imgs";
    $stmt2 = $cn->prepare($sql2);
    $stmt2->execute();
    $rows2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);



    $productos = [];
foreach($rows as $row){
    $id = $row["id"];

    if(!isset($productos[$id])){
        $productos[$id] = [
            'id' => $row['id'],
            'nombre' => $row['nombre'],
            'descripcion' => $row['descripcion'],
            'categoria_id' => $row['categoria_id'],
            'precio' => $row['precio'],
            'imgs' => []
        ];
    }
}

foreach($rows2 as $row2){
    $idProduct = $row2["product_id"];

    if (isset($productos[$idProduct])) {
        $productos[$idProduct]["imgs"][] = [
            "id" => $row2["image_id"],
            "images" => $row2["images"]
        ];
    }
}       


$productos = array_values($productos);


 $countSql = "SELECT COUNT(*) FROM productos WHERE 1";
    if (!empty($searchQuery)) $countSql .= " AND nombre LIKE :searchQuery";
    if (!empty($categoryId)) $countSql .= " AND categoria_id = :categoryId";

    $countStmt = $cn->prepare($countSql);
    if (!empty($searchQuery)) $countStmt->bindValue(':searchQuery', "%$searchQuery%", PDO::PARAM_STR);
    if (!empty($categoryId)) $countStmt->bindValue(':categoryId', (int)$categoryId, PDO::PARAM_INT);
    $countStmt->execute();
    $totalProductos = (int)$countStmt->fetchColumn();

    $totalPages = $totalProductos > 0 ? (int)ceil($totalProductos / $pageSize) : 1;



    echo json_encode([
         "status" => "success",
        "currentPage" => $page,
        "pageSize" => $pageSize,
        "totalPages" => $totalPages,
        "total" => $totalProductos  ,
        "data" => $productos,

    ]);



} catch(PDOException $e) {
       http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?> 