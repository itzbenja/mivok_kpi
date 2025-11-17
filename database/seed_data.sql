-- Script para generar 5000 registros de datos realistas para Mivok
-- Ejecutar después de crear las tablas del schema.sql

-- Función auxiliar para generar fechas aleatorias
CREATE OR REPLACE FUNCTION random_date(start_date DATE, end_date DATE)
RETURNS DATE AS $$
BEGIN
  RETURN start_date + (random() * (end_date - start_date))::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- 1. Insertar 200 DJs
DO $$
DECLARE
  nombres_djs TEXT[] := ARRAY['DJ Pulse', 'DJ Vibe', 'DJ Nova', 'DJ Storm', 'DJ Echo', 'DJ Remix', 'DJ Bass', 'DJ Flow', 'DJ Wave', 'DJ Spark'];
  apellidos TEXT[] := ARRAY['Martinez', 'Rodriguez', 'Gonzalez', 'Lopez', 'Hernandez', 'Garcia', 'Perez', 'Sanchez', 'Ramirez', 'Torres'];
  generos TEXT[][] := ARRAY[
    ARRAY['House', 'Techno'],
    ARRAY['Reggaeton', 'Latin'],
    ARRAY['Rock', 'Pop'],
    ARRAY['Hip Hop', 'R&B'],
    ARRAY['Electronic', 'Trance'],
    ARRAY['Cumbia', 'Salsa'],
    ARRAY['Trap', 'Urban']
  ];
  ciudades TEXT[] := ARRAY['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Viña del Mar', 'Antofagasta', 'Temuco'];
  i INTEGER;
BEGIN
  FOR i IN 1..200 LOOP
    INSERT INTO djs (
      nombre,
      email,
      telefono,
      generos_musicales,
      precio_hora_min,
      precio_hora_max,
      ubicacion,
      rating,
      total_eventos,
      eventos_completados,
      eventos_rechazados,
      fecha_registro,
      activo
    ) VALUES (
      nombres_djs[1 + floor(random() * 10)::INT] || ' ' || apellidos[1 + floor(random() * 10)::INT],
      'dj' || i || '@mivok.com',
      '+569' || lpad(floor(random() * 100000000)::TEXT, 8, '0'),
      generos[1 + floor(random() * 7)::INT],
      50000 + floor(random() * 50000),
      100000 + floor(random() * 150000),
      ciudades[1 + floor(random() * 7)::INT],
      3.0 + (random() * 2.0)::NUMERIC(3,2),
      floor(random() * 50)::INT,
      floor(random() * 45)::INT,
      floor(random() * 5)::INT,
      NOW() - (random() * 730 || ' days')::INTERVAL,
      random() > 0.1
    );
  END LOOP;
END $$;

-- 2. Insertar 500 Clientes
DO $$
DECLARE
  nombres TEXT[] := ARRAY['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Diego', 'Sofia', 'Miguel', 'Valentina'];
  apellidos TEXT[] := ARRAY['Martinez', 'Rodriguez', 'Gonzalez', 'Lopez', 'Hernandez', 'Garcia', 'Perez', 'Sanchez', 'Ramirez', 'Torres'];
  empresas TEXT[] := ARRAY['Eventos SA', 'Party Pro', 'Celebrations Inc', 'EventMaster', 'Fiesta Total', NULL, NULL, NULL];
  ciudades TEXT[] := ARRAY['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Viña del Mar', 'Antofagasta', 'Temuco'];
  i INTEGER;
BEGIN
  FOR i IN 1..500 LOOP
    INSERT INTO clientes (
      nombre,
      email,
      telefono,
      empresa,
      ubicacion,
      total_eventos,
      fecha_registro,
      activo
    ) VALUES (
      nombres[1 + floor(random() * 10)::INT] || ' ' || apellidos[1 + floor(random() * 10)::INT],
      'cliente' || i || '@email.com',
      '+569' || lpad(floor(random() * 100000000)::TEXT, 8, '0'),
      empresas[1 + floor(random() * 8)::INT],
      ciudades[1 + floor(random() * 7)::INT],
      floor(random() * 15)::INT,
      NOW() - (random() * 730 || ' days')::INTERVAL,
      random() > 0.05
    );
  END LOOP;
END $$;

-- 3. Insertar 5000 Eventos
DO $$
DECLARE
  tipos_evento TEXT[] := ARRAY['Boda', 'Cumpleaños', 'Corporativo', 'Fiesta Temática', 'Graduación', 'Año Nuevo', 'Concierto'];
  estados TEXT[] := ARRAY['completado', 'completado', 'completado', 'completado', 'cancelado', 'rechazado', 'pendiente', 'aceptado'];
  motivos TEXT[] := ARRAY['No disponible en esa fecha', 'Fuera de mi zona', 'Precio muy bajo', 'Tipo de evento no adecuado', NULL, NULL];
  dj_ids UUID[];
  cliente_ids UUID[];
  i INTEGER;
  dj_random UUID;
  cliente_random UUID;
  fecha_evento DATE;
  estado_evento TEXT;
  precio_base DECIMAL;
  duracion DECIMAL;
BEGIN
  -- Obtener IDs de DJs y Clientes
  SELECT ARRAY_AGG(id) INTO dj_ids FROM djs;
  SELECT ARRAY_AGG(id) INTO cliente_ids FROM clientes;

  FOR i IN 1..5000 LOOP
    dj_random := dj_ids[1 + floor(random() * array_length(dj_ids, 1))::INT];
    cliente_random := cliente_ids[1 + floor(random() * array_length(cliente_ids, 1))::INT];
    fecha_evento := random_date('2023-01-01'::DATE, '2025-12-31'::DATE);
    estado_evento := estados[1 + floor(random() * 8)::INT];
    duracion := 2 + (random() * 6)::NUMERIC(4,2);
    precio_base := 80000 + floor(random() * 220000);

    INSERT INTO eventos (
      dj_id,
      cliente_id,
      tipo_evento,
      fecha_evento,
      hora_inicio,
      duracion_horas,
      ubicacion,
      precio_ofrecido,
      precio_final,
      estado,
      motivo_rechazo,
      rating_dj,
      rating_cliente,
      comentario_cliente,
      fecha_creacion
    ) VALUES (
      dj_random,
      cliente_random,
      tipos_evento[1 + floor(random() * 7)::INT],
      fecha_evento,
      (15 + floor(random() * 9))::TEXT || ':00:00',
      duracion,
      'Dirección ' || floor(random() * 9999)::TEXT || ', Santiago',
      precio_base,
      CASE 
        WHEN estado_evento IN ('completado', 'aceptado') THEN precio_base + (random() * 20000 - 10000)
        ELSE NULL 
      END,
      estado_evento,
      CASE 
        WHEN estado_evento = 'rechazado' THEN motivos[1 + floor(random() * 6)::INT]
        ELSE NULL 
      END,
      CASE 
        WHEN estado_evento = 'completado' THEN 1 + floor(random() * 5)::INT
        ELSE NULL 
      END,
      CASE 
        WHEN estado_evento = 'completado' THEN 1 + floor(random() * 5)::INT
        ELSE NULL 
      END,
      CASE 
        WHEN estado_evento = 'completado' AND random() > 0.3 THEN 
          CASE floor(random() * 5)::INT
            WHEN 0 THEN 'Excelente servicio, muy profesional'
            WHEN 1 THEN 'Buen ambiente, todos disfrutaron'
            WHEN 2 THEN 'Cumplió con lo esperado'
            WHEN 3 THEN 'Buena música, recomendado'
            ELSE 'Muy contento con el servicio'
          END
        ELSE NULL 
      END,
      fecha_evento - (random() * 60 || ' days')::INTERVAL
    );
  END LOOP;
END $$;

-- 4. Insertar Transacciones para eventos completados
INSERT INTO transacciones (evento_id, monto, comision_plataforma, metodo_pago, estado, fecha_transaccion)
SELECT 
  e.id,
  e.precio_final,
  e.precio_final * 0.10, -- 10% comisión
  CASE floor(random() * 3)::INT
    WHEN 0 THEN 'Tarjeta'
    WHEN 1 THEN 'Transferencia'
    ELSE 'Efectivo'
  END,
  CASE 
    WHEN e.estado = 'completado' THEN 'completado'
    WHEN e.estado = 'cancelado' AND random() > 0.5 THEN 'reembolsado'
    ELSE 'procesando'
  END,
  e.fecha_evento + (random() || ' days')::INTERVAL
FROM eventos e
WHERE e.estado IN ('completado', 'cancelado') AND e.precio_final IS NOT NULL;

-- 5. Actualizar estadísticas de DJs
UPDATE djs d SET
  total_eventos = (SELECT COUNT(*) FROM eventos WHERE dj_id = d.id AND estado != 'pendiente'),
  eventos_completados = (SELECT COUNT(*) FROM eventos WHERE dj_id = d.id AND estado = 'completado'),
  eventos_rechazados = (SELECT COUNT(*) FROM eventos WHERE dj_id = d.id AND estado = 'rechazado'),
  rating = (SELECT COALESCE(AVG(rating_dj), 0) FROM eventos WHERE dj_id = d.id AND rating_dj IS NOT NULL);

-- 6. Actualizar estadísticas de Clientes
UPDATE clientes c SET
  total_eventos = (SELECT COUNT(*) FROM eventos WHERE cliente_id = c.id AND estado IN ('completado', 'aceptado'));

-- Limpiar función temporal
DROP FUNCTION IF EXISTS random_date(DATE, DATE);

-- Verificar datos insertados
SELECT 'DJs insertados:' as tabla, COUNT(*) as total FROM djs
UNION ALL
SELECT 'Clientes insertados:', COUNT(*) FROM clientes
UNION ALL
SELECT 'Eventos insertados:', COUNT(*) FROM eventos
UNION ALL
SELECT 'Transacciones insertadas:', COUNT(*) FROM transacciones;
