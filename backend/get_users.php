<?php
header('Content-Type: application/json');
include 'db.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE estado = 'activo' ORDER BY nombres ASC");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>