<?php
// Encabezados CORS
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Manejar solicitud preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['nombres']) || !isset($data['apellidos']) || !isset($data['telefono']) || !isset($data['email'])) {
    echo json_encode(['error' => 'Campos requeridos faltantes']);
    exit;
}

// Validaciones regex
if (!preg_match('/^[a-zA-Z\s]+$/', $data['nombres']) || !preg_match('/^[a-zA-Z\s]+$/', $data['apellidos'])) {
    echo json_encode(['error' => 'Nombres y apellidos solo letras y espacios']);
    exit;
}
if (!preg_match('/^\d{7,15}$/', $data['telefono'])) {  // Solo números, min 7 dígitos
    echo json_encode(['error' => 'Teléfono solo números (7-15 dígitos)']);
    exit;
}
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['error' => 'Email inválido']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO usuarios (nombres, apellidos, telefono, email) VALUES (?, ?, ?, ?)");
    $stmt->execute([$data['nombres'], $data['apellidos'], $data['telefono'], $data['email']]);
    echo json_encode(['success' => 'Usuario creado']);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {  // Duplicate entry
        echo json_encode(['error' => 'Email ya existe']);
    } else {
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>