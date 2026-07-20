<?php
/**
 * ⚙️ CONFIGURACIÓN DE LA BASE DE DATOS
 *
 * CÓMO USAR ESTE ARCHIVO:
 *   1. En el hosting (cPanel > Administrador de archivos), copiá este archivo
 *      y renombrá la copia a:  config.php
 *   2. Completá los 4 valores con los datos reales.
 *   3. ¡Listo! config.php nunca se sube a GitHub (está en .gitignore),
 *      así tu contraseña queda protegida.
 */
return [
    'host' => 'localhost',            // casi siempre es localhost
    'name' => 'renacer',              // nombre de la base (con prefijo si tu hosting lo agrega, ej: usuario_renacer)
    'user' => 'TU_USUARIO_MYSQL',     // cPanel > Bases de datos MySQL > Usuarios actuales
    'pass' => 'TU_CONTRASENA_MYSQL',
];
