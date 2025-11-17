-- Tabla de DJs
CREATE TABLE djs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  generos_musicales TEXT[], -- Array de géneros
  precio_hora_min DECIMAL(10,2),
  precio_hora_max DECIMAL(10,2),
  ubicacion VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 0,
  total_eventos INTEGER DEFAULT 0,
  eventos_completados INTEGER DEFAULT 0,
  eventos_rechazados INTEGER DEFAULT 0,
  fecha_registro TIMESTAMP DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla de Clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  empresa VARCHAR(100),
  ubicacion VARCHAR(100),
  total_eventos INTEGER DEFAULT 0,
  fecha_registro TIMESTAMP DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla de Eventos
CREATE TABLE eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dj_id UUID REFERENCES djs(id),
  cliente_id UUID REFERENCES clientes(id),
  tipo_evento VARCHAR(50) NOT NULL, -- boda, cumpleaños, corporativo, fiesta, concierto
  fecha_evento DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  duracion_horas DECIMAL(4,2) NOT NULL,
  ubicacion VARCHAR(200),
  precio_ofrecido DECIMAL(10,2),
  precio_final DECIMAL(10,2),
  estado VARCHAR(30) NOT NULL, -- pendiente, aceptado, rechazado, completado, cancelado
  motivo_rechazo TEXT,
  rating_dj INTEGER CHECK (rating_dj >= 1 AND rating_dj <= 5),
  rating_cliente INTEGER CHECK (rating_cliente >= 1 AND rating_cliente <= 5),
  comentario_cliente TEXT,
  comentario_dj TEXT,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

-- Tabla de Transacciones
CREATE TABLE transacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id UUID REFERENCES eventos(id),
  monto DECIMAL(10,2) NOT NULL,
  comision_plataforma DECIMAL(10,2),
  metodo_pago VARCHAR(50), -- tarjeta, transferencia, efectivo
  estado VARCHAR(30) NOT NULL, -- pendiente, procesando, completado, reembolsado
  fecha_transaccion TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_eventos_fecha ON eventos(fecha_evento);
CREATE INDEX idx_eventos_estado ON eventos(estado);
CREATE INDEX idx_eventos_dj ON eventos(dj_id);
CREATE INDEX idx_eventos_cliente ON eventos(cliente_id);
CREATE INDEX idx_transacciones_evento ON transacciones(evento_id);
CREATE INDEX idx_djs_rating ON djs(rating);
