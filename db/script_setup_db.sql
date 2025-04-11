-- Usar la base de datos
USE cats;

-- Crear tabla propietarios
CREATE TABLE propietarios (
  id INT NOT NULL AUTO_INCREMENT,
  nickname VARCHAR(255) NOT NULL UNIQUE,
  nombre VARCHAR(255),
  edad INT,
  nacionalidad VARCHAR(255),
  PRIMARY KEY (id)
);

-- Crear tabla gatos
CREATE TABLE gatos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  edad INT,
  raza VARCHAR(255),
  propietario VARCHAR(255),
  id_propietario INT,
  PRIMARY KEY (id),
  FOREIGN KEY (id_propietario) REFERENCES propietarios(id),
  FOREIGN KEY (propietario) REFERENCES propietarios(nickname)
);

-- Insertar propietarios
INSERT INTO propietarios (nickname, nombre, edad, nacionalidad) VALUES
('gatolover99', 'Carlos Pérez', 34, 'España'),
('miauqueen', 'Laura Torres', 28, 'Argentina'),
('bigcatdad', 'Jorge Ramírez', 41, 'México'),
('felina', 'Sofía Delgado', 22, 'Chile'),
('ronron', 'Luis Herrera', 30, 'Colombia'),
('elbigote', 'Francisco', 34, 'Colombia'),
('lobezno', 'Amancio', 52, 'Dominicana');

-- Insertar gatos
INSERT INTO gatos (nombre, edad, raza, propietario, id_propietario) VALUES
('Michi', 2, 'Siames', 'gatolover99', 1),
('Luna', 4, 'Persa', 'miauqueen', 2),
('Garfield', 5, 'Naranja', 'bigcatdad', 3),
('Nube', 1, 'Angora', 'felina', 4),
('Tigre', 3, 'Bengala', 'ronron', 5),
('Leon', 2, 'Naranja', 'ronron', 5);
