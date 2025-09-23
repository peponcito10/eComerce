<?php 

$dsn = 'mysql:dbname=ecomerce;host=127.0.0.1';
$usuario = 'root';
$clave = '';

    $cn = new PDO($dsn, $usuario, $clave);
    // Obetenemos el valor de cat= del url
    $categoria = $_GET['cat'] ?? '';

    if ($categoria === '0' || $categoria === '') { // Todos los valores
        // Si no viene categoría, devolver todos
        $sql = "SELECT * FROM productos";
        $rs = $cn->query($sql);

    } else {// valor filtrados

        // Filtrar por categoría
        $sql = "SELECT * FROM productos WHERE categoria_id = ?";
        $rs = $cn->prepare($sql);
        $rs->execute([$categoria]);
    }

    $rows = $rs->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($rows, JSON_UNESCAPED_UNICODE);
