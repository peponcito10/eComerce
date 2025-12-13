<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$dsn = 'mysql:dbname=ecomerce;host=127.0.0.1';
$usuario = 'root';
$clave = '';

try {
    $cn = new PDO($dsn, $usuario, $clave);
    $cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Leer JSON del body
    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    // ====== Parámetros de paginado y filtros ======
    $searchQuery = $input["searchQuery"] ?? ''; 
    $pageSize = isset($input["pageSize"]) ? (int)$input["pageSize"] : 10;
    $page = isset($input["page"]) ? (int)$input["page"] : 1;
    $categoryId = $input["categoryId"] ?? null;

    $offset = ($page - 1) * $pageSize;

    // ====== Consulta principal con LEFT JOIN para imágenes ======
    $sql = "
        SELECT 
            p.id, p.nombre, p.descripcion, p.categoria_id, p.precio,
            pi.id AS img_id, pi.images
        FROM productos p
        LEFT JOIN producto_imgs pi ON pi.product_id = p.id
        WHERE 1
    ";

    if (!empty($searchQuery)) {
        $sql .= " AND p.nombre LIKE :searchQuery";
    }
    if (!empty($categoryId)) {
        $sql .= " AND p.categoria_id = :categoryId";
    }

    $sql .= " ORDER BY p.id ASC LIMIT :pageSize OFFSET :offset";

    $stmt = $cn->prepare($sql);

    if (!empty($searchQuery)) $stmt->bindValue(':searchQuery', "%$searchQuery%", PDO::PARAM_STR);
    if (!empty($categoryId)) $stmt->bindValue(':categoryId', (int)$categoryId, PDO::PARAM_INT);
    $stmt->bindValue(':pageSize', (int)$pageSize, PDO::PARAM_INT);
    $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);

    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ====== Reconstruir productos con sus imágenes ======

    $productos = [];
    foreach ($rows as $row) {
        $id = $row['id'];
        if (!isset($productos[$id])) {
            $productos[$id] = [
                    'id' => $row['id'],
                    'nombre' => $row['nombre'],
                    'descripcion' => $row['descripcion'],
                    'categoria_id' => $row['categoria_id'],
                    'precio' => $row['precio'],
                    'imgs' => []
            ];
        }



        if ($row['img_id']) {
            $productos[$id]['imgs'][] = [
                'id' => $row['img_id'],
                'images' => $row['images']
            ];
        }
    }
    $productos = array_values($productos); // reindexar

    // ====== Contar total de productos ======
    $countSql = "SELECT COUNT(*) FROM productos WHERE 1";
    if (!empty($searchQuery)) $countSql .= " AND nombre LIKE :searchQuery";
    if (!empty($categoryId)) $countSql .= " AND categoria_id = :categoryId";

    $countStmt = $cn->prepare($countSql);
    if (!empty($searchQuery)) $countStmt->bindValue(':searchQuery', "%$searchQuery%", PDO::PARAM_STR);
    if (!empty($categoryId)) $countStmt->bindValue(':categoryId', (int)$categoryId, PDO::PARAM_INT);
    $countStmt->execute();
    $totalProductos = (int)$countStmt->fetchColumn();

    $totalPages = $totalProductos > 0 ? (int)ceil($totalProductos / $pageSize) : 1;

    // ====== Respuesta JSON ======
    echo json_encode([
        "status" => "success",
        "currentPage" => $page,
        "page" => $page,
        "pageSize" => $pageSize,
        "totalPages" => $totalPages,
        "total" => $totalProductos,
        "data" => $productos,
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
