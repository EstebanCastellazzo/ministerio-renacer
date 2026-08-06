-- =========================================================
-- Curso "Sanando la Herencia" — Ministerio Cristiano Renacer
-- Tabla de inscripciones al curso.
--
-- CÓMO USARLO EN PHPMYADMIN:
--   1) Entrá a phpMyAdmin y seleccioná tu base de datos
--      (o creala primero, ver docs/BASE-DE-DATOS.md).
--   2) Pestaña "SQL" > pegá todo este contenido > "Continuar".
-- =========================================================

CREATE TABLE IF NOT EXISTS inscripciones (
  id            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  nombre        VARCHAR(80)      NOT NULL,
  apellido      VARCHAR(80)      NOT NULL,
  telefono      VARCHAR(30)      NOT NULL,
  edad          TINYINT UNSIGNED NOT NULL,
  curso         VARCHAR(100)     NOT NULL DEFAULT 'sanando-la-herencia',
  utm_source    VARCHAR(100)     NULL,          -- de qué red vino (ej: ig)
  utm_medium    VARCHAR(100)     NULL,          -- tipo de pauta (ej: reel)
  utm_campaign  VARCHAR(100)     NULL,          -- nombre de la campaña
  utm_content   VARCHAR(100)     NULL,          -- qué reel específico
  ip            VARCHAR(45)      NULL,
  creado_en     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_curso (curso),
  KEY idx_creado (creado_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
