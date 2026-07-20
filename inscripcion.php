<?php
/**
 * Guarda las inscripciones del curso "Sanando la Herencia" en MySQL.
 * Recibe JSON por POST desde js/herencia.js y responde JSON.
 *
 * ⚙️ CONFIGURACIÓN: completá estos 4 datos con los de tu hosting
 * (los encontrás en cPanel > Bases de datos MySQL, o te los da tu proveedor).
 */
const DB_HOST = 'localhost';
const DB_NAME = 'renacer_cursos';      // nombre de la base de datos
const DB_USER = 'TU_USUARIO_MYSQL';    // usuario de MySQL
const DB_PASS = 'TU_CONTRASENA_MYSQL'; // contraseña de MySQL

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido.']);
    exit;
}

$datos = json_decode(file_get_contents('php://input'), true);
if (!is_array($datos)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Datos inválidos.']);
    exit;
}

// Honeypot: si el campo oculto viene completado, es un bot. Respondemos ok sin guardar.
if (!empty($datos['sitio_web'])) {
    echo json_encode(['ok' => true]);
    exit;
}

$nombre   = trim($datos['nombre'] ?? '');
$apellido = trim($datos['apellido'] ?? '');
$telefono = trim($datos['telefono'] ?? '');
$edad     = filter_var($datos['edad'] ?? null, FILTER_VALIDATE_INT);

if (mb_strlen($nombre) < 2 || mb_strlen($nombre) > 80) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Ingresá un nombre válido.']);
    exit;
}
if (mb_strlen($apellido) < 2 || mb_strlen($apellido) > 80) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Ingresá un apellido válido.']);
    exit;
}
if (strlen(preg_replace('/\D/', '', $telefono)) < 8 || mb_strlen($telefono) > 30) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Ingresá un teléfono válido.']);
    exit;
}
if ($edad === false || $edad < 12 || $edad > 99) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Ingresá una edad válida.']);
    exit;
}

$curso = mb_substr(trim($datos['curso'] ?? 'sanando-la-herencia'), 0, 100);
$utm   = static function (string $clave) use ($datos): ?string {
    $v = trim((string)($datos[$clave] ?? ''));
    return $v === '' ? null : mb_substr($v, 0, 100);
};

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    $sql = 'INSERT INTO inscripciones
            (nombre, apellido, telefono, edad, curso, utm_source, utm_medium, utm_campaign, utm_content, ip)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    $pdo->prepare($sql)->execute([
        $nombre,
        $apellido,
        $telefono,
        $edad,
        $curso,
        $utm('utm_source'),
        $utm('utm_medium'),
        $utm('utm_campaign'),
        $utm('utm_content'),
        substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 45),
    ]);

    echo json_encode(['ok' => true]);
} catch (PDOException $e) {
    // No exponemos el detalle del error de base de datos al visitante.
    error_log('Inscripción curso - error BD: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No pudimos guardar tu inscripción. Intentá de nuevo en unos minutos.']);
}
