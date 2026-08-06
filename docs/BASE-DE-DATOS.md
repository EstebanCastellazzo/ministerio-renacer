# Base de datos para las inscripciones al curso

Guía paso a paso para dejar funcionando la base de datos del formulario de
`herencia.html` usando **phpMyAdmin** (hosting típico con cPanel).

---

## Paso 1 — Crear la base de datos y el usuario

> En la mayoría de los hostings compartidos la base **no** se crea desde
> phpMyAdmin sino desde cPanel, porque phpMyAdmin no tiene permisos para
> `CREATE DATABASE`. Elegí el camino que corresponda a tu caso:

### Opción A: hosting con cPanel (lo más común)

1. Entrá a **cPanel** → sección **Bases de datos** → **Bases de datos MySQL®**.
2. En *Crear nueva base de datos* escribí: `renacer_cursos` → **Crear base de datos**.
   (El hosting suele agregarle un prefijo, ej: `micuenta_renacer_cursos` — anotá el nombre completo).
3. Más abajo, en *Usuarios de MySQL* → *Añadir nuevo usuario*: creá un usuario
   (ej: `renacer_app`) con una contraseña fuerte. Anotá usuario y contraseña.
4. En *Añadir usuario a la base de datos*: seleccioná el usuario y la base,
   clic en **Añadir** y marcá **TODOS LOS PRIVILEGIOS** → **Hacer cambios**.

### Opción B: phpMyAdmin con permisos (servidor propio / local como XAMPP)

1. Abrí **phpMyAdmin**.
2. Clic en la pestaña **SQL** y ejecutá:

```sql
CREATE DATABASE renacer_cursos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Paso 2 — Crear la tabla `inscripciones`

1. En **phpMyAdmin**, en el panel izquierdo, hacé clic en la base de datos
   (`renacer_cursos` o `micuenta_renacer_cursos`).
2. Andá a la pestaña **SQL**.
3. Abrí el archivo [`sql/inscripciones.sql`](../sql/inscripciones.sql) de este
   repositorio, copiá TODO su contenido, pegalo en el cuadro y presioná **Continuar**.
4. Deberías ver el mensaje verde y la tabla `inscripciones` en el panel izquierdo.

La tabla guarda: nombre, apellido, teléfono, edad, curso, los UTM de la pauta
(para saber **qué reel trajo a cada inscripto**), la IP y la fecha de registro.

---

## Paso 3 — Conectar el formulario

Las credenciales van en un archivo `config.php` que vive **solo en el hosting**
(está en `.gitignore`, así la contraseña nunca queda expuesta en GitHub).

1. Subí al hosting: `herencia.html`, `css/herencia.css`, `js/herencia.js`,
   `inscripcion.php` y `config.ejemplo.php`.
2. En **cPanel → Administrador de archivos**, copiá `config.ejemplo.php` y
   renombrá la copia a `config.php`.
3. Editá `config.php` con tus datos reales:

```php
return [
    'host' => 'localhost',            // casi siempre es localhost
    'name' => 'renacer',              // el nombre COMPLETO de la base (con prefijo si lo tiene)
    'user' => 'el_usuario_mysql',     // cPanel > Bases de datos MySQL > Usuarios actuales
    'pass' => 'la_contraseña',
];
```

---

## Paso 4 — Probar

1. Entrá a `https://tudominio.com/herencia`.
2. Completá el formulario con datos de prueba y enviá.
3. En phpMyAdmin: base de datos → tabla `inscripciones` → pestaña **Examinar**.
   Tu registro de prueba tiene que aparecer ahí. Después podés borrarlo con el
   botón **Eliminar** de esa fila.

---

## Ver y exportar los inscriptos

- **Ver**: phpMyAdmin → `inscripciones` → **Examinar** (ordenados por fecha).
- **Exportar a Excel**: con la tabla abierta → pestaña **Exportar** → formato
  **CSV para MS Excel** → **Continuar**. Se descarga un archivo que abre
  directo en Excel/Google Sheets.
- **Saber qué reel funciona mejor**: pestaña SQL y ejecutá:

```sql
SELECT utm_content AS reel, COUNT(*) AS inscriptos
FROM inscripciones
GROUP BY utm_content
ORDER BY inscriptos DESC;
```

> Para que esto funcione, pautá cada reel con un link del estilo:
> `https://tudominio.com/herencia?utm_source=ig&utm_medium=reel&utm_campaign=herencia&utm_content=reel-enojo`
> cambiando `utm_content` en cada reel. La landing captura esos valores sola.
