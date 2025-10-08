<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['nombres']) || !isset($data['apellidos']) || !isset($data['telefono']) || !isset($data['email'])) {
    echo json_encode(['error' => 'Campos requeridos faltantes']);
    exit;
}

// Validaciones iguales a create
if (!preg_match('/^[a-zA-Z\s]+$/', $data['nombres']) || !preg_match('/^[a-zA-Z\s]+$/', $data['apellidos'])) {
    echo json_encode(['error' => 'Nombres y apellidos solo letras y espacios']);
    exit;
}
if (!preg_match('/^\d{7,20}$/', $data['telefono'])) {
    echo json_encode(['error' => 'Teléfono solo números (7-20 dígitos)']);
    exit;
}
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['error' => 'Email inválido']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE usuarios SET nombres = ?, apellidos = ?, telefono = ?, email = ? WHERE id = ? AND estado = 'activo'");
    $stmt->execute([$data['nombres'], $data['apellidos'], $data['telefono'], $data['email'], $data['id']]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => 'Usuario actualizado']);
    } else {
        echo json_encode(['error' => 'Usuario no encontrado']);
    }
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['error' => 'Email ya existe']);
    } else {
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>