<?php
$dsn = 'mysql:dbname=ecomerce;host=127.0.0.1';
$usuario = 'root';
$clave = '';

try {
    $cn = new PDO($dsn, $usuario, $clave);
    $cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Base del query
    $sql = "SELECT * FROM productos WHERE 1";
    $params = [];

    // Filtro por precios
    if (!empty($_POST['preciomin']) && !empty($_POST['preciomax'])) {
        $sql .= " AND precio BETWEEN ? AND ?";
        $params[] = $_POST['preciomin'];
        $params[] = $_POST['preciomax'];
    }

    // Filtro por nombre
    if (!empty($_POST['search'])) {
        $sql .= " AND nombre LIKE ?";
        $params[] = '%' . $_POST['search'] . '%';
    }

    // Ejecutar consulta segura
    $rs = $cn->prepare($sql);
    $rs->execute($params);
    $productos = $rs->fetchAll(PDO::FETCH_ASSOC);

    // Obtener imágenes
    $sql2 = "SELECT id, product_id, images FROM producto_imgs";
    $rs2 = $cn->prepare($sql2);
    $rs2->execute();
    $imagenes = $rs2->fetchAll(PDO::FETCH_ASSOC);

    // Asociar imágenes con productos
    foreach ($productos as &$producto) {
        $producto['imgs'] = array_values(array_filter($imagenes, function($img) use ($producto) {
            return $img['product_id'] == $producto['id'];
        }));
    }

    echo json_encode($productos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
