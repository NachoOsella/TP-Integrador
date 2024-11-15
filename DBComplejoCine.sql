

create table Barrios(
id_Barrio int identity(1,1),
Nombre_Barrio varchar(100)
constraint pk_Barrios primary key (id_Barrio))

create table Sucursales(
id_sucursal int,
id_barrio int not null,
nombre_sucursal varchar(50),
CONSTRAINT pk_id_sucursal PRIMARY KEY (id_sucursal),
CONSTRAINT fk_id_barrio FOREIGN KEY (id_barrio) REFERENCES Barrios (id_barrio)
)

create table Tipos_Documentos(
Id_tipo_Doc int identity (1,1),
Descripcion varchar(20)
constraint pk_Tipo_Documentos primary key (Id_tipo_Doc))

Create Table Generos_pelis(
id_genero int identity(1,1),
descripcion varchar (100)
constraint pk_genero primary key (id_genero))

Create Table Edades(
id_edad int identity(1,1),
clasificacion varchar (100)
constraint pk_edad primary key (id_edad))

create table Tipo_Salas(
id_tipo_Sala int identity(1,1),
Descripcion varchar(100)
constraint pk_TipoSala primary key (id_tipo_sala))

create table Salas(
nro_sala int,
capacidad int not null,
id_tipo_sala int not null,
id_sucursal int not null,
CONSTRAINT pk_nro_sala PRIMARY KEY (nro_sala),
CONSTRAINT fk_id_tipo_sala FOREIGN KEY (id_tipo_sala) REFERENCES Tipo_Salas (id_tipo_sala),
CONSTRAINT fk_id_sucursal FOREIGN KEY (id_sucursal) references Sucursales (id_sucursal)
)

Create Table Idioma(id_idioma int identity(1,1),
descripcion varchar (100),
subtitulos bit,
constraint pk_idioma primary key (id_idioma))

create table Tipos_Butacas(
id_tipo_butaca int IDENTITY,
descripcion varchar(100),
CONSTRAINT pk_id_tipo_butaca PRIMARY KEY (id_tipo_butaca)
)

create table Clientes(
id_cliente int identity(1,1),
nombre varchar(20),
apellido varchar(20),
telefono int,
Id_tipo_Doc int,
dni int,
mail varchar(100),
constraint pk_Clientes primary key (id_cliente),
constraint fk_tipoDoc_cliente foreign key (Id_tipo_Doc) references Tipos_Documentos (Id_tipo_Doc)
)

create table Formato_Peliculas(
id_formato int identity(1,1),
Tipo_formato varchar(100)
constraint pk_Formato_peli primary key (id_formato)
)

create table Butacas(
id_butaca int identity(1,1),
nro_butaca int not null,
nro_sala int not null,
id_tipo_butaca int not null,
disponible bit not null,
CONSTRAINT pk_butaca PRIMARY KEY (id_butaca),
CONSTRAINT fk_id_tipo_butaca FOREIGN KEY (id_tipo_butaca) REFERENCES Tipos_Butacas(id_tipo_butaca),
CONSTRAINT fk_nro_Sala FOREIGN KEY (nro_sala) REFERENCES Salas (nro_sala)
)

Create Table Directores(
id_director int identity(1,1),
descripcion varchar(200),
constraint pk_director primary key (id_director)
)

Create Table Peliculas(
id_pelicula int identity (1, 1),
titulo varchar (100),
id_genero int,
id_edad int,
duracion smallint,
descripcion varchar (100),
id_director int,
estreno bit,
url varchar (200),
constraint pk_pelicula primary key (id_pelicula),
constraint fk_genero foreign key (id_genero) references Generos_pelis (id_genero),
constraint fk_edad foreign key (id_edad) references Edades (id_edad),
constraint fk_direct foreign key (id_director) references Directores (id_director)
)

Create Table Actores(
id_actor int identity(1,1),
descripcion varchar(200),
constraint pk_actor primary key (id_actor)
)
Create Table Peli_Actor(
id_pelicula int,
id_actor int,
constraint pk_peli_actor primary key (id_pelicula, id_actor),
constraint fk_peli foreign key (id_pelicula) references Peliculas (id_pelicula),
constraint fk_actor foreign key (id_actor) references Actores (id_actor)
)

Create Table Funciones(
nro_funcion int identity(1,1),
dia datetime,
hora datetime,
id_pelicula int,
nro_sala int,
id_formato int,
id_idioma int,
capacidad int,
constraint pk_nro_funcion PRIMARY KEY (nro_funcion),
FOREIGN KEY (id_pelicula) REFERENCES Peliculas (id_pelicula),
FOREIGN KEY (nro_sala) REFERENCES Salas (nro_sala),
FOREIGN KEY (id_formato) REFERENCES Formato_Peliculas (id_formato),
FOREIGN KEY (id_idioma) REFERENCES Idioma (id_idioma),
)

create table Reservas(
id_reserva int identity (1,1),
id_cliente int,
nro_funcion int, 
fecha_reserva datetime, 
confirmacion bit,
constraint pk_reserva primary key (id_reserva),
constraint fk_cliente foreign key (id_cliente) references Clientes(id_cliente), 
constraint fk_nro_funcion foreign key (nro_funcion) references Funciones (nro_funcion)
)

Create Table Promociones(
cod_promocion int,
descripcion varchar (250),
fec_inicio datetime,
fec_fin datetime,
descuento int,
Constraint pk_cod_promocion PRIMARY KEY (cod_promocion)
)

create table Ticket(
nro_Ticket int identity(1,1),
nro_funcion int,
id_butaca int,
constraint pk_ticket primary key (nro_ticket),
constraint fk_ticket_funcion foreign key (nro_funcion) references Funciones (nro_funcion),
constraint fk_ticket_butaca foreign key (id_butaca) references Butacas (id_butaca)
)

Create Table Formas_de_pago(
id_forma_de_pago int,
descripcion varchar (100),
Constraint pk_id_forma_de_pago PRIMARY KEY (id_forma_de_pago)
)

create table Facturas(
nro_factura int identity(1,1),
monto money,
fecha datetime, 
id_forma_de_pago int,
id_cliente int,
CONSTRAINT pk_nro_factura PRIMARY KEY (nro_factura),
CONSTRAINT fk_id_forma_de_pago FOREIGN KEY (id_forma_de_pago) REFERENCES Formas_de_pago (id_forma_de_pago),
CONSTRAINT fk_id_clientel FOREIGN KEY (id_cliente) references Clientes (id_cliente)
)

create table Detalle_Factura(
id_detalle_factura int identity(1,1),
nro_funcion int,
nro_factura int,
cod_promocion int,
cantidad_ticket int,
constraint pk_Detalle_factura primary key (id_detalle_factura),
constraint fk_DetFac_Factura foreign key (nro_factura) references Facturas (nro_factura),
constraint fk_DetFac_Funcion foreign key (nro_funcion) references Funciones (nro_funcion),
constraint fk_DetFac_Prom foreign key (cod_promocion) references Promociones (cod_promocion)
)

-- Insertar datos en la tabla Barrios
INSERT INTO Barrios (Nombre_Barrio) VALUES ('Arguello');
INSERT INTO Barrios (Nombre_Barrio) VALUES ('Centro');
INSERT INTO Barrios (Nombre_Barrio) VALUES ('Nueva C�rdoba');
INSERT INTO Barrios (Nombre_Barrio) VALUES ('Alto Alberdi');
INSERT INTO Barrios (Nombre_Barrio) VALUES ('Barrio Jardin');

-- Insertar datos en la tabla Tipos_Documentos
INSERT INTO Tipos_Documentos (Descripcion) VALUES ('DNI');
INSERT INTO Tipos_Documentos (Descripcion) VALUES ('Pasaporte');

-- Insertar datos en la tabla Generos_pelis
INSERT INTO Generos_pelis (descripcion) VALUES ('Acci�n');
INSERT INTO Generos_pelis (descripcion) VALUES ('Comedia');
INSERT INTO Generos_pelis (descripcion) VALUES ('Terror');
INSERT INTO Generos_pelis (descripcion) VALUES ('Drama');
INSERT INTO Generos_pelis (descripcion) VALUES ('Animacion');
INSERT INTO Generos_pelis (descripcion) VALUES ('Sci-Fi');
INSERT INTO Generos_pelis (descripcion) VALUES ('Documentales');

-- Insertar datos en la tabla Edades
INSERT INTO Edades (clasificacion) VALUES ('+12');
INSERT INTO Edades (clasificacion) VALUES ('+18');

-- Insertar datos en la tabla Tipo_Salas
INSERT INTO Tipo_Salas (Descripcion) VALUES ('Sala IMAX');
INSERT INTO Tipo_Salas (Descripcion) VALUES ('Sala Chica');
INSERT INTO Tipo_Salas (Descripcion) VALUES ('Sala Mediana');

-- Insertar datos en la tabla Idioma
INSERT INTO Idioma (descripcion, subtitulos) VALUES ('Espa�ol', 0);
INSERT INTO Idioma (descripcion, subtitulos) VALUES ('Ingl�s', 1);

-- Insertar datos en la tabla Tipos_Butacas
INSERT INTO Tipos_Butacas (descripcion) VALUES ('Butaca Normal');
INSERT INTO Tipos_Butacas (descripcion) VALUES ('Butaca VIP');
INSERT INTO Tipos_Butacas (descripcion) VALUES ('Discapacitado');

-- Insertar datos en la tabla Formato_Peliculas
INSERT INTO Formato_Peliculas (Tipo_formato) VALUES ('2D');
INSERT INTO Formato_Peliculas (Tipo_formato) VALUES ('3D');

-- Insertar datos en la tabla Formas_de_pago
INSERT INTO Formas_de_pago (id_forma_de_pago,descripcion) VALUES (1,'Efectivo');
INSERT INTO Formas_de_pago (id_forma_de_pago,descripcion) VALUES (2,'Tarjeta de cr�dito');
INSERT INTO Formas_de_pago (id_forma_de_pago,descripcion) VALUES (3,'Tarjeta de D�bito');
INSERT INTO Formas_de_pago (id_forma_de_pago,descripcion) VALUES (4,'Transferencia');

-- Insertar datos en la tabla Sucursales
INSERT INTO Sucursales (id_sucursal, id_barrio, nombre_sucursal) VALUES (1, 1, 'Sucursal Arguello');
INSERT INTO Sucursales (id_sucursal, id_barrio, nombre_sucursal) VALUES (2, 2, 'Sucursal Nueva C�rdoba');

-- Insertar datos en la tabla Salas
-- Insertar datos en la tabla Salas para la Sucursal 1
INSERT INTO Salas (nro_sala, capacidad, id_tipo_sala, id_sucursal) VALUES (101, 300, 1, 1);
INSERT INTO Salas (nro_sala, capacidad, id_tipo_sala, id_sucursal) VALUES (102, 60, 2, 1);
INSERT INTO Salas (nro_sala, capacidad, id_tipo_sala, id_sucursal) VALUES (103, 150, 3, 1);
INSERT INTO Salas (nro_sala, capacidad, id_tipo_sala, id_sucursal) VALUES (104, 60, 2, 1);
INSERT INTO Salas (nro_sala, capacidad, id_tipo_sala, id_sucursal) VALUES (105, 50, 2, 1);

-- Insertar datos en la tabla Salas para la Sucursal 2
INSERT INTO Salas (nro_sala, capacidad, id_tipo_sala, id_sucursal) VALUES (201, 350, 1, 2);
INSERT INTO Salas (nro_sala, capacidad, id_tipo_sala, id_sucursal) VALUES (202, 85, 2, 2);
INSERT INTO Salas (nro_sala, capacidad, id_tipo_sala, id_sucursal) VALUES (203, 70, 2, 2);
INSERT INTO Salas (nro_sala, capacidad, id_tipo_sala, id_sucursal) VALUES (204, 85, 2, 2);
INSERT INTO Salas (nro_sala, capacidad, id_tipo_sala, id_sucursal) VALUES (205, 110, 3, 2);

-- Insertar datos en la tabla Butacas
--Sala 101
DECLARE @i INT = 1;
DECLARE @n int = 1;
DECLARE @r int;
WHILE @i <= 300
BEGIN
     SET @r = CAST((RAND() * 3 + 1) AS INT);
    INSERT INTO Butacas (nro_butaca, nro_sala, id_tipo_butaca, disponible)
    VALUES (@n,101, @r, 1);
    SET @i = @i + 1;
    SET @n = @n + 1;
END;

--sala 102
SET @i = 1;
SET @n = 1;
WHILE @i <= 60
BEGIN
     SET @r = CAST((RAND() * 3 + 1) AS INT);
    INSERT INTO Butacas (nro_butaca, nro_sala, id_tipo_butaca, disponible)
    VALUES (@n,102, @r, 1);
    SET @i = @i + 1;
    SET @n = @n + 1;
END;

--Sala 103
SET @i = 1;
SET @n = 1;
WHILE @i <= 150
BEGIN
     SET @r = CAST((RAND() * 3 + 1) AS INT);
    INSERT INTO Butacas (nro_butaca, nro_sala, id_tipo_butaca, disponible)
    VALUES (@n,103, @r, 1);
    SET @i = @i + 1;
    SET @n = @n + 1;
END;

--Sala 104
SET @i = 1;
SET @n = 1;
WHILE @i <= 60
BEGIN
     SET @r = CAST((RAND() * 3 + 1) AS INT);
    INSERT INTO Butacas (nro_butaca, nro_sala, id_tipo_butaca, disponible)
    VALUES (@n,104, @r, 1);
    SET @i = @i + 1;
    SET @n = @n + 1;
END;

--Sala 105
SET @i = 1;
SET @n = 1;
WHILE @i <= 50
BEGIN
     SET @r = CAST((RAND() * 3 + 1) AS INT);
    INSERT INTO Butacas (nro_butaca, nro_sala, id_tipo_butaca, disponible)
    VALUES (@n,105, @r, 1);
    SET @i = @i + 1;
    SET @n = @n + 1;
END;

--201
SET @i = 1;
SET @n = 1;
WHILE @i <= 350
BEGIN
     SET @r = CAST((RAND() * 3 + 1) AS INT);
    INSERT INTO Butacas (nro_butaca, nro_sala, id_tipo_butaca, disponible)
    VALUES (@n,201, @r, 1);
    SET @i = @i + 1;
    SET @n = @n + 1;
END;

--202
SET @i = 1;
SET @n = 1;
WHILE @i <= 85
BEGIN
     SET @r = CAST((RAND() * 3 + 1) AS INT);
    INSERT INTO Butacas (nro_butaca, nro_sala, id_tipo_butaca, disponible)
    VALUES (@n,202, @r, 1);
    SET @i = @i + 1;
    SET @n = @n + 1;
END;

--203
SET @i = 1;
SET @n = 1;
WHILE @i <= 70
BEGIN
     SET @r = CAST((RAND() * 3 + 1) AS INT);
    INSERT INTO Butacas (nro_butaca, nro_sala, id_tipo_butaca, disponible)
    VALUES (@n,203, @r, 1);
    SET @i = @i + 1;
    SET @n = @n + 1;
END;

--204
SET @i = 1;
SET @n = 1;
WHILE @i <= 85
BEGIN
     SET @r = CAST((RAND() * 3 + 1) AS INT);
    INSERT INTO Butacas (nro_butaca, nro_sala, id_tipo_butaca, disponible)
    VALUES (@n,204, @r, 1);
    SET @i = @i + 1;
    SET @n = @n + 1;
END;

--205
SET @i = 1;
SET @n = 1;
WHILE @i <= 110
BEGIN
     SET @r = CAST((RAND() * 3 + 1) AS INT);
    INSERT INTO Butacas (nro_butaca, nro_sala, id_tipo_butaca, disponible)
    VALUES (@n,205, @r, 1);
    SET @i = @i + 1;
    SET @n = @n + 1;
END;
select * from Butacas
-- Insertar datos en la tabla Clientes
INSERT INTO Clientes (nombre, apellido, telefono, Id_tipo_Doc, dni, mail) VALUES ('Juan', 'P�rez', 123456789, 1, 12345678, 'juan.perez@example.com');
INSERT INTO Clientes (nombre, apellido, telefono, Id_tipo_Doc, dni, mail) VALUES ('Mar�a', 'G�mez', 987654321, 2, 87654321, 'maria.gomez@example.com');
INSERT INTO Clientes (nombre, apellido, telefono, Id_tipo_Doc, dni, mail) VALUES ('Lautaro', 'Ponse', 192873971, 1, 4399253, 'Ponse@mysql.com');

-- Insertar datos en la tabla Directores
INSERT INTO Directores (descripcion) VALUES ('Quentin Tarantino');
INSERT INTO Directores (descripcion) VALUES ('Christopher Nolan');
INSERT INTO Directores (descripcion) VALUES ('Steven Spielberg');
INSERT INTO Directores (descripcion) VALUES ('Martin Scorsese');
INSERT INTO Directores (descripcion) VALUES ('Hayao Miyazaki');
INSERT INTO Directores (descripcion) VALUES ('Franco Vazquez IZ');

-- Insertar datos en la tabla Peliculas
INSERT INTO Peliculas (titulo, id_genero, id_edad, duracion,id_director ,descripcion) VALUES ('BarbiHaimer', 1, 1, 240, 1,'Pelicula Sobre la Bomba nuclear de Barbilandia');
INSERT INTO Peliculas (titulo, id_genero, id_edad, duracion,id_director ,descripcion) VALUES ('Jujutsu Kaisen: Goyo re', 5, 1, 120, 2,'Pelicula Del comic');
INSERT INTO Peliculas (titulo, id_genero, id_edad, duracion,id_director ,descripcion) VALUES ('Juego del Miedo', 3, 2, 180,3, 'Pelicula Gore');
INSERT INTO Peliculas (titulo, id_genero, id_edad, duracion,id_director ,descripcion) VALUES ('Truman Show', 2, 1, 90,4, 'Pelicula....');
INSERT INTO Peliculas (titulo, id_genero, id_edad, duracion,id_director ,descripcion) VALUES ('Bajo la Misma Estrella', 4, 2, 150,5, 'Pelicula....');
INSERT INTO Peliculas (titulo, id_genero, id_edad, duracion,id_director ,descripcion) VALUES ('Interestelar', 6, 1, 210,5, 'Pelicula....');
INSERT INTO Peliculas (titulo, id_genero, id_edad, duracion,id_director ,descripcion) VALUES ('Cosmos', 7, 2, 265,3, 'Pelicula....');

-- Insertar datos en la tabla Actores
INSERT INTO Actores (descripcion) VALUES ('Leonardo DiCaprio');
INSERT INTO Actores (descripcion) VALUES ('Meryl Streep');
INSERT INTO Actores (descripcion) VALUES ('Robert De Niro');
INSERT INTO Actores (descripcion) VALUES ('Scarlett Johansson');
INSERT INTO Actores (descripcion) VALUES ('Johnny Depp');

-- Insertar datos en la tabla Peli_Actor
INSERT INTO Peli_Actor (id_pelicula, id_actor) VALUES (1, 1);
INSERT INTO Peli_Actor (id_pelicula, id_actor) VALUES (1, 2);
INSERT INTO Peli_Actor (id_pelicula, id_actor) VALUES (3, 3);
INSERT INTO Peli_Actor (id_pelicula, id_actor) VALUES (4, 4);
INSERT INTO Peli_Actor (id_pelicula, id_actor) VALUES (5, 5);
INSERT INTO Peli_Actor (id_pelicula, id_actor) VALUES (2, 1);
INSERT INTO Peli_Actor (id_pelicula, id_actor) VALUES (2, 3);
INSERT INTO Peli_Actor (id_pelicula, id_actor) VALUES (6, 2);
INSERT INTO Peli_Actor (id_pelicula, id_actor) VALUES (7, 4);
INSERT INTO Peli_Actor (id_pelicula, id_actor) VALUES (7, 5);

-- Insertar datos en la tabla Funciones
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-15', '18:00', 1, 101, 1, 1);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-15', '20:30', 2, 102, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-15', '16:30', 3, 103, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-15', '18:00', 4, 104, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-15', '22:30', 5, 105, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-15', '15:45', 6, 201, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-15', '19:30', 7, 202, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-15', '13:00', 3, 203, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-15', '10:30', 5, 204, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-15', '11:15', 7, 205, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-18', '16:00', 1, 101, 1, 1);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-18', '20:00', 2, 102, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-18', '16:30', 3, 103, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-23', '18:00', 4, 104, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-23', '22:30', 5, 105, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-10-23', '15:45', 6, 201, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-11-01', '19:30', 7, 202, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-11-03', '13:00', 3, 203, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-11-04', '10:30', 5, 204, 2, 2);
INSERT INTO Funciones (dia, hora, id_pelicula, nro_sala, id_formato, id_idioma) VALUES ('2023-12-26', '11:15', 7, 205, 2, 2);

-- Insertar datos en la tabla Promociones
INSERT INTO Promociones (cod_promocion, descripcion, fec_inicio, fec_fin, descuento) VALUES (1, '2 x 1', '2023-10-10', '2023-10-20', 2);
INSERT INTO Promociones (cod_promocion, descripcion, fec_inicio, fec_fin, descuento) VALUES (2, 'Balde Pochoclo c/ 2 Gaseosas', '2023-10-12', '2023-10-22', 5);

-- Insertar datos en la tabla Facturas
INSERT INTO Facturas (monto, fecha, id_forma_de_pago, id_cliente) VALUES (50.00, '2023-10-15', 1, 1);
INSERT INTO Facturas (monto, fecha, id_forma_de_pago, id_cliente) VALUES (60.00, '2023-10-15', 3, 2);
INSERT INTO Facturas (monto, fecha, id_forma_de_pago, id_cliente) VALUES (100.00, '2023-10-15', 2, 2);
INSERT INTO Facturas (monto, fecha, id_forma_de_pago, id_cliente) VALUES (20.00, '2023-10-15', 4, 1);
INSERT INTO Facturas (monto, fecha, id_forma_de_pago, id_cliente) VALUES (40.00, '2023-10-15', 3, 3);

-- Insertar datos en la tabla Detalle_Factura
INSERT INTO Detalle_Factura (nro_funcion, nro_factura, cod_promocion, cantidad_ticket) VALUES (1, 1, 1, 2);
INSERT INTO Detalle_Factura (nro_funcion, nro_factura, cod_promocion, cantidad_ticket) VALUES (5, 2, 2, 3);
INSERT INTO Detalle_Factura (nro_funcion, nro_factura, cod_promocion, cantidad_ticket) VALUES (3, 3, 1, 6);
INSERT INTO Detalle_Factura (nro_funcion, nro_factura, cod_promocion, cantidad_ticket) VALUES (8, 4, 2, 1);
INSERT INTO Detalle_Factura (nro_funcion, nro_factura, cod_promocion, cantidad_ticket) VALUES (2, 5, 1, 1);

-- Insertar Datos en la Tabla Tickets
INSERT INTO Ticket (nro_funcion, id_butaca) VALUES
(1, 1), (2, 5), (3, 10), (4, 15), (5, 20),
(1, 2), (2, 6), (3, 11), (4, 16), (5, 21);
INSERT INTO Ticket (nro_funcion, id_butaca) VALUES
(1, 3), (2, 7), (3, 12), (4, 17), (5, 22),
(1, 4), (2, 8), (3, 13), (4, 18), (5, 23);
INSERT INTO Ticket (nro_funcion, id_butaca) VALUES
(1, 5), (2, 9), (3, 14), (4, 19), (5, 24),
(1, 6), (2, 10), (3, 15), (4, 20), (5, 25);
INSERT INTO Ticket (nro_funcion, id_butaca) VALUES
(1, 7), (2, 11), (3, 16), (4, 21), (5, 26),
(1, 8), (2, 12), (3, 17), (4, 22), (5, 27);
INSERT INTO Ticket (nro_funcion, id_butaca) VALUES
(1, 9), (2, 13), (3, 18), (4, 23), (5, 28),
(1, 10), (2, 14), (3, 19), (4, 24), (5, 29);


--Listar cantidad de peliculas, t�tulo, la primera fecha y �ltima fecha de tickets donde el monto 
--sea superior a 200 del mes pasado 

 Select count(*) 'Cant.Peliculas  ', titulo  ' Pelicula  ', max (dia) 'Ultima Fecha', min (dia)    
 ' Primera Fecha'
  From Facturas f Join Detalle_Factura df on  f.nro_factura= df.nro_factura
  Join Funciones fu on df.nro_funcion = fu.nro_funcion
  Join Peliculas p on fu.id_pelicula = p.id_pelicula
 Where datediff(month,fecha,getdate())=1
 group by titulo
 Having min (monto)> 200
 
--listar por pelicula y funcion, la cantidad de tickets vendidos 
--en lo que va del mes y cantidad de peliculas, siempre que el titulo de la pelicula comience 
--con letras que van de la "a" a la "r"y que la minima cantidad vendida (de esa pelicula y esa funcion) 
--haya sido mayor a 5 

Select p.id_pelicula, titulo, f.nro_funcion, count(cantidad_ticket) 'Cant Tickets vendidos'
from peliculas p join funciones f on p.id_pelicula=f.id_pelicula
join detalle_factura d on d.nro_funcion = f.nro_funcion 
join facturas fc on fc.nro_factura= d.nro_factura
where month(fecha)=month (getdate())
and year (fecha)=year(getdate())
and titulo like '[A-R]%' 
group by p.id_pelicula, titulo, f.nro_funcion
having min(cantidad_ticket) > 5






--listar clientes que no compraron ticket de pelicula con clasificaci�n +12 el mes pasado y por otro lado
--clientes que compraron peliculas con edad +18 elmes pasado cuyas cantidad no sea mayor a 30 tickets. 
--Agregar columna que los identifique y ordenar segun id 
select id_cliente, nombre, apellido, 'no compr�' Observacion 
from clientes 
where id_cliente not in (select id_cliente
                         from Facturas f join Detalle_Factura d 
						 on f.nro_factura=d.nro_factura 
						 join Funciones fun on fun.nro_funcion=d.nro_funcion
						 join peliculas p on p.id_pelicula=fun.id_pelicula
						 join edades e on e.id_edad=p.id_edad
                         where datediff(month, fecha, getdate())=1
                         and year(fecha)=year(getdate())
                         and clasificacion like '+12')
UNION 
select id_cliente, nombre, apellido, 'Si compr�' 
from clientes 
where id_cliente in (select id_cliente 
from facturas f join detalle_factura d on f.nro_factura=d.nro_factura
join Funciones fun on fun.nro_funcion=d.nro_funcion
						 join peliculas p on p.id_pelicula=fun.id_pelicula
						 join edades e on e.id_edad=p.id_edad
where datediff(month, fecha, getdate())=1
and year (fecha)=year(getdate())
and clasificacion like '+18'
and cantidad_ticket < 30)

order by 1


--Seleccionar Las Peliculas que En las que haya dos o mas actores, mostrando el titulo, Director, Genero de Pelicula y la cantidad de funciones.
Select titulo, duracion, d.descripcion 'Director', g.descripcion 'Genero',count(f.nro_funcion) 'Cantidad De funciones'
From Peliculas p join Peli_Actor pa on p.id_pelicula = pa.id_pelicula
                 join Actores a on a.id_actor = pa.id_actor
				 join Directores d on p.id_director = d.id_director
				 join Generos_pelis g on p.id_genero = g.id_genero
				 join Funciones f on p.id_pelicula = f.id_pelicula
where 2 <= (select count(id_actor)
             from Peli_Actor pa2
			 where p.id_pelicula = pa2.id_pelicula)
group by titulo,duracion, d.descripcion,g.descripcion

-- Muestra los clientes que han usado Tarjeta de Credito y de Debito.
SELECT UPPER(C.apellido) + ' ' + c.nombre as 'Cliente', c.mail, c.telefono,'Tarjeta de Cr�dito' Tipo_Pago_Utilizado
FROM Clientes C
where c.id_cliente in(select f.id_cliente
                      from Facturas f
					  join Formas_de_pago fp on f.id_forma_de_pago=fp.id_forma_de_pago
					  where fp.descripcion like '%Cr�dito%' and c.id_cliente = f.id_cliente)
UNION
SELECT UPPER(C.apellido) + ' ' + c.nombre, c.mail, c.telefono,'Tarjeta de Debito' Tipo_Pago_Utilizado
FROM Clientes C
where c.id_cliente in(select f.id_cliente
                      from Facturas f
					  join Formas_de_pago fp on f.id_forma_de_pago=fp.id_forma_de_pago
					  where fp.descripcion like 'Tarjeta de D�bito' and c.id_cliente = f.id_cliente)


select * from Clientes
select * from Formas_de_pago
Select * from Facturas



SELECT DISTINCT p.titulo as Pelicula, s.nombre_sucursal as Sucursal
FROM Funciones f
JOIN Peliculas p ON p.id_pelicula = f.id_pelicula
JOIN Salas sa ON sa.nro_sala = f.nro_sala
JOIN Sucursales s ON s.id_sucursal = sa.id_sucursal
WHERE P.titulo IN (
    SELECT P.titulo as Pelicula
    FROM Funciones f
    JOIN Peliculas p ON p.id_pelicula = f.id_pelicula
    JOIN Salas sa ON sa.nro_sala = f.nro_sala
    GROUP BY P.titulo
    HAVING COUNT(DISTINCT sa.id_sucursal) = 1)
ORDER BY 2
