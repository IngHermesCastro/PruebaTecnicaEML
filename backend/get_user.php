<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php';

if (!isset($_GET['id'])) {
    echo json_encode(['error' => 'ID requerido']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE id = ? AND estado = 'activo'");
    $stmt->execute([$_GET['id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        echo json_encode($user);
    } else {
        echo json_encode(['error' => 'Usuario no encontrado']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>