<?php 

        $dato1 = $_GET["id"];

        $dsn = 'mysql:dbname=ecomerce;host=127.0.0.1';
        $usuario = 'root';
        $clave = '';
        $cn = new PDO($dsn, $usuario, $clave);

        $sql = "SELECT p.*, s.stock
                from productos p
                INNER JOIN producto_stock s
                ON p.id = s.product_id
                WHERE p.id=".$dato1;

        $rs = $cn->prepare($sql);
        $rs->execute();
        $data = $rs->fetch(PDO::FETCH_ASSOC);

        $sql2 = "SELECT id, images FROM producto_imgs
                WHERE product_id = ".$dato1;

        $rs2 = $cn->prepare($sql2);
        $rs2->execute();
        $data['imgs'] = $rs2->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);

?>