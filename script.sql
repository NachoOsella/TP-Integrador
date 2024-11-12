USE [master]
GO
/****** Object:  Database [ComplejoCines]    Script Date: 12/11/2024 12:28:28 ******/
CREATE DATABASE [ComplejoCines]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'ComplejoCines', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\ComplejoCines.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'ComplejoCines_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\ComplejoCines_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [ComplejoCines] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ComplejoCines].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ComplejoCines] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ComplejoCines] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ComplejoCines] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ComplejoCines] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ComplejoCines] SET ARITHABORT OFF 
GO
ALTER DATABASE [ComplejoCines] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [ComplejoCines] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ComplejoCines] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ComplejoCines] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ComplejoCines] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ComplejoCines] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ComplejoCines] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ComplejoCines] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ComplejoCines] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ComplejoCines] SET  ENABLE_BROKER 
GO
ALTER DATABASE [ComplejoCines] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ComplejoCines] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ComplejoCines] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ComplejoCines] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ComplejoCines] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ComplejoCines] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ComplejoCines] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ComplejoCines] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [ComplejoCines] SET  MULTI_USER 
GO
ALTER DATABASE [ComplejoCines] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ComplejoCines] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ComplejoCines] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ComplejoCines] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [ComplejoCines] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [ComplejoCines] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [ComplejoCines] SET QUERY_STORE = ON
GO
ALTER DATABASE [ComplejoCines] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [ComplejoCines]
GO
/****** Object:  Table [dbo].[Actores]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Actores](
	[id_actor] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](200) NULL,
 CONSTRAINT [pk_actor] PRIMARY KEY CLUSTERED 
(
	[id_actor] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Barrios]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Barrios](
	[id_Barrio] [int] IDENTITY(1,1) NOT NULL,
	[Nombre_Barrio] [varchar](100) NULL,
 CONSTRAINT [pk_Barrios] PRIMARY KEY CLUSTERED 
(
	[id_Barrio] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Butacas]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Butacas](
	[id_butaca] [int] IDENTITY(1,1) NOT NULL,
	[nro_butaca] [int] NOT NULL,
	[nro_sala] [int] NOT NULL,
	[id_tipo_butaca] [int] NOT NULL,
	[disponible] [bit] NOT NULL,
 CONSTRAINT [pk_butaca] PRIMARY KEY CLUSTERED 
(
	[id_butaca] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Clientes]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Clientes](
	[id_cliente] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](20) NULL,
	[apellido] [varchar](20) NULL,
	[telefono] [int] NULL,
	[Id_tipo_Doc] [int] NULL,
	[dni] [int] NULL,
	[mail] [varchar](100) NULL,
	[contraseña] [varchar](100) NULL,
 CONSTRAINT [pk_Clientes] PRIMARY KEY CLUSTERED 
(
	[id_cliente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Detalle_Factura]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Detalle_Factura](
	[id_detalle_factura] [int] IDENTITY(1,1) NOT NULL,
	[nro_funcion] [int] NULL,
	[nro_factura] [int] NULL,
	[cod_promocion] [int] NULL,
 CONSTRAINT [pk_Detalle_factura] PRIMARY KEY CLUSTERED 
(
	[id_detalle_factura] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Directores]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Directores](
	[id_director] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](200) NULL,
 CONSTRAINT [pk_director] PRIMARY KEY CLUSTERED 
(
	[id_director] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Edades]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Edades](
	[id_edad] [int] IDENTITY(1,1) NOT NULL,
	[clasificacion] [varchar](100) NULL,
 CONSTRAINT [pk_edad] PRIMARY KEY CLUSTERED 
(
	[id_edad] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Facturas]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Facturas](
	[nro_factura] [int] IDENTITY(1,1) NOT NULL,
	[monto] [money] NULL,
	[fecha] [datetime] NULL,
	[id_forma_de_pago] [int] NULL,
	[id_cliente] [int] NULL,
 CONSTRAINT [pk_nro_factura] PRIMARY KEY CLUSTERED 
(
	[nro_factura] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Formas_de_pago]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Formas_de_pago](
	[id_forma_de_pago] [int] NOT NULL,
	[descripcion] [varchar](100) NULL,
 CONSTRAINT [pk_id_forma_de_pago] PRIMARY KEY CLUSTERED 
(
	[id_forma_de_pago] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Formato_Peliculas]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Formato_Peliculas](
	[id_formato] [int] IDENTITY(1,1) NOT NULL,
	[Tipo_formato] [varchar](100) NULL,
 CONSTRAINT [pk_Formato_peli] PRIMARY KEY CLUSTERED 
(
	[id_formato] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Funciones]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Funciones](
	[nro_funcion] [int] IDENTITY(1,1) NOT NULL,
	[dia] [datetime] NULL,
	[hora] [datetime] NULL,
	[id_pelicula] [int] NULL,
	[nro_sala] [int] NULL,
	[id_formato] [int] NULL,
	[id_idioma] [int] NULL,
 CONSTRAINT [pk_nro_funcion] PRIMARY KEY CLUSTERED 
(
	[nro_funcion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Generos_pelis]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Generos_pelis](
	[id_genero] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](100) NULL,
 CONSTRAINT [pk_genero] PRIMARY KEY CLUSTERED 
(
	[id_genero] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Idioma]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Idioma](
	[id_idioma] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](100) NULL,
	[subtitulos] [bit] NULL,
 CONSTRAINT [pk_idioma] PRIMARY KEY CLUSTERED 
(
	[id_idioma] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Peli_Actor]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Peli_Actor](
	[id_pelicula] [int] NOT NULL,
	[id_actor] [int] NOT NULL,
 CONSTRAINT [pk_peli_actor] PRIMARY KEY CLUSTERED 
(
	[id_pelicula] ASC,
	[id_actor] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Peliculas]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Peliculas](
	[id_pelicula] [int] IDENTITY(1,1) NOT NULL,
	[titulo] [varchar](100) NULL,
	[id_genero] [int] NULL,
	[id_edad] [int] NULL,
	[duracion] [smallint] NULL,
	[descripcion] [varchar](200) NULL,
	[id_director] [int] NULL,
	[estreno] [bit] NULL,
	[url] [varchar](200) NULL,
 CONSTRAINT [pk_pelicula] PRIMARY KEY CLUSTERED 
(
	[id_pelicula] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Promociones]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Promociones](
	[cod_promocion] [int] NOT NULL,
	[descripcion] [varchar](250) NULL,
	[fec_inicio] [datetime] NULL,
	[fec_fin] [datetime] NULL,
	[descuento] [int] NULL,
 CONSTRAINT [pk_cod_promocion] PRIMARY KEY CLUSTERED 
(
	[cod_promocion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Reservas]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Reservas](
	[id_reserva] [int] IDENTITY(1,1) NOT NULL,
	[id_cliente] [int] NULL,
	[nro_funcion] [int] NULL,
	[fecha_reserva] [datetime] NULL,
	[confirmacion] [bit] NULL,
 CONSTRAINT [pk_reserva] PRIMARY KEY CLUSTERED 
(
	[id_reserva] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Salas]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Salas](
	[nro_sala] [int] NOT NULL,
	[capacidad] [int] NOT NULL,
	[id_tipo_sala] [int] NOT NULL,
	[id_sucursal] [int] NOT NULL,
 CONSTRAINT [pk_nro_sala] PRIMARY KEY CLUSTERED 
(
	[nro_sala] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Sucursales]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sucursales](
	[id_sucursal] [int] NOT NULL,
	[id_barrio] [int] NOT NULL,
	[nombre_sucursal] [varchar](50) NULL,
 CONSTRAINT [pk_id_sucursal] PRIMARY KEY CLUSTERED 
(
	[id_sucursal] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tickets]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tickets](
	[nro_Ticket] [int] IDENTITY(1,1) NOT NULL,
	[nro_funcion] [int] NOT NULL,
	[id_butaca] [int] NOT NULL,
 CONSTRAINT [pk_ticket] PRIMARY KEY CLUSTERED 
(
	[nro_Ticket] ASC,
	[nro_funcion] ASC,
	[id_butaca] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tipo_Salas]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tipo_Salas](
	[id_tipo_Sala] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](100) NULL,
 CONSTRAINT [pk_TipoSala] PRIMARY KEY CLUSTERED 
(
	[id_tipo_Sala] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tipos_Butacas]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tipos_Butacas](
	[id_tipo_butaca] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](100) NULL,
 CONSTRAINT [pk_id_tipo_butaca] PRIMARY KEY CLUSTERED 
(
	[id_tipo_butaca] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tipos_Documentos]    Script Date: 12/11/2024 12:28:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tipos_Documentos](
	[Id_tipo_Doc] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](20) NULL,
 CONSTRAINT [pk_Tipo_Documentos] PRIMARY KEY CLUSTERED 
(
	[Id_tipo_Doc] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Butacas]  WITH CHECK ADD  CONSTRAINT [fk_id_tipo_butaca] FOREIGN KEY([id_tipo_butaca])
REFERENCES [dbo].[Tipos_Butacas] ([id_tipo_butaca])
GO
ALTER TABLE [dbo].[Butacas] CHECK CONSTRAINT [fk_id_tipo_butaca]
GO
ALTER TABLE [dbo].[Butacas]  WITH CHECK ADD  CONSTRAINT [fk_nro_Sala] FOREIGN KEY([nro_sala])
REFERENCES [dbo].[Salas] ([nro_sala])
GO
ALTER TABLE [dbo].[Butacas] CHECK CONSTRAINT [fk_nro_Sala]
GO
ALTER TABLE [dbo].[Clientes]  WITH CHECK ADD  CONSTRAINT [fk_tipoDoc_cliente] FOREIGN KEY([Id_tipo_Doc])
REFERENCES [dbo].[Tipos_Documentos] ([Id_tipo_Doc])
GO
ALTER TABLE [dbo].[Clientes] CHECK CONSTRAINT [fk_tipoDoc_cliente]
GO
ALTER TABLE [dbo].[Detalle_Factura]  WITH CHECK ADD  CONSTRAINT [fk_DetFac_Factura] FOREIGN KEY([nro_factura])
REFERENCES [dbo].[Facturas] ([nro_factura])
GO
ALTER TABLE [dbo].[Detalle_Factura] CHECK CONSTRAINT [fk_DetFac_Factura]
GO
ALTER TABLE [dbo].[Detalle_Factura]  WITH CHECK ADD  CONSTRAINT [fk_DetFac_Funcion] FOREIGN KEY([nro_funcion])
REFERENCES [dbo].[Funciones] ([nro_funcion])
GO
ALTER TABLE [dbo].[Detalle_Factura] CHECK CONSTRAINT [fk_DetFac_Funcion]
GO
ALTER TABLE [dbo].[Detalle_Factura]  WITH CHECK ADD  CONSTRAINT [fk_DetFac_Prom] FOREIGN KEY([cod_promocion])
REFERENCES [dbo].[Promociones] ([cod_promocion])
GO
ALTER TABLE [dbo].[Detalle_Factura] CHECK CONSTRAINT [fk_DetFac_Prom]
GO
ALTER TABLE [dbo].[Facturas]  WITH CHECK ADD  CONSTRAINT [fk_id_clientel] FOREIGN KEY([id_cliente])
REFERENCES [dbo].[Clientes] ([id_cliente])
GO
ALTER TABLE [dbo].[Facturas] CHECK CONSTRAINT [fk_id_clientel]
GO
ALTER TABLE [dbo].[Facturas]  WITH CHECK ADD  CONSTRAINT [fk_id_forma_de_pago] FOREIGN KEY([id_forma_de_pago])
REFERENCES [dbo].[Formas_de_pago] ([id_forma_de_pago])
GO
ALTER TABLE [dbo].[Facturas] CHECK CONSTRAINT [fk_id_forma_de_pago]
GO
ALTER TABLE [dbo].[Funciones]  WITH CHECK ADD FOREIGN KEY([id_formato])
REFERENCES [dbo].[Formato_Peliculas] ([id_formato])
GO
ALTER TABLE [dbo].[Funciones]  WITH CHECK ADD FOREIGN KEY([id_idioma])
REFERENCES [dbo].[Idioma] ([id_idioma])
GO
ALTER TABLE [dbo].[Funciones]  WITH CHECK ADD FOREIGN KEY([id_pelicula])
REFERENCES [dbo].[Peliculas] ([id_pelicula])
GO
ALTER TABLE [dbo].[Funciones]  WITH CHECK ADD FOREIGN KEY([nro_sala])
REFERENCES [dbo].[Salas] ([nro_sala])
GO
ALTER TABLE [dbo].[Peli_Actor]  WITH CHECK ADD  CONSTRAINT [fk_actor] FOREIGN KEY([id_actor])
REFERENCES [dbo].[Actores] ([id_actor])
GO
ALTER TABLE [dbo].[Peli_Actor] CHECK CONSTRAINT [fk_actor]
GO
ALTER TABLE [dbo].[Peli_Actor]  WITH CHECK ADD  CONSTRAINT [fk_peli] FOREIGN KEY([id_pelicula])
REFERENCES [dbo].[Peliculas] ([id_pelicula])
GO
ALTER TABLE [dbo].[Peli_Actor] CHECK CONSTRAINT [fk_peli]
GO
ALTER TABLE [dbo].[Peliculas]  WITH CHECK ADD  CONSTRAINT [fk_direct] FOREIGN KEY([id_director])
REFERENCES [dbo].[Directores] ([id_director])
GO
ALTER TABLE [dbo].[Peliculas] CHECK CONSTRAINT [fk_direct]
GO
ALTER TABLE [dbo].[Peliculas]  WITH CHECK ADD  CONSTRAINT [fk_edad] FOREIGN KEY([id_edad])
REFERENCES [dbo].[Edades] ([id_edad])
GO
ALTER TABLE [dbo].[Peliculas] CHECK CONSTRAINT [fk_edad]
GO
ALTER TABLE [dbo].[Peliculas]  WITH CHECK ADD  CONSTRAINT [fk_genero] FOREIGN KEY([id_genero])
REFERENCES [dbo].[Generos_pelis] ([id_genero])
GO
ALTER TABLE [dbo].[Peliculas] CHECK CONSTRAINT [fk_genero]
GO
ALTER TABLE [dbo].[Reservas]  WITH CHECK ADD  CONSTRAINT [fk_cliente] FOREIGN KEY([id_cliente])
REFERENCES [dbo].[Clientes] ([id_cliente])
GO
ALTER TABLE [dbo].[Reservas] CHECK CONSTRAINT [fk_cliente]
GO
ALTER TABLE [dbo].[Reservas]  WITH CHECK ADD  CONSTRAINT [fk_nro_funcion] FOREIGN KEY([nro_funcion])
REFERENCES [dbo].[Funciones] ([nro_funcion])
GO
ALTER TABLE [dbo].[Reservas] CHECK CONSTRAINT [fk_nro_funcion]
GO
ALTER TABLE [dbo].[Salas]  WITH CHECK ADD  CONSTRAINT [fk_id_sucursal] FOREIGN KEY([id_sucursal])
REFERENCES [dbo].[Sucursales] ([id_sucursal])
GO
ALTER TABLE [dbo].[Salas] CHECK CONSTRAINT [fk_id_sucursal]
GO
ALTER TABLE [dbo].[Salas]  WITH CHECK ADD  CONSTRAINT [fk_id_tipo_sala] FOREIGN KEY([id_tipo_sala])
REFERENCES [dbo].[Tipo_Salas] ([id_tipo_Sala])
GO
ALTER TABLE [dbo].[Salas] CHECK CONSTRAINT [fk_id_tipo_sala]
GO
ALTER TABLE [dbo].[Sucursales]  WITH CHECK ADD  CONSTRAINT [fk_id_barrio] FOREIGN KEY([id_barrio])
REFERENCES [dbo].[Barrios] ([id_Barrio])
GO
ALTER TABLE [dbo].[Sucursales] CHECK CONSTRAINT [fk_id_barrio]
GO
ALTER TABLE [dbo].[Tickets]  WITH CHECK ADD  CONSTRAINT [fk_ticket_butaca] FOREIGN KEY([id_butaca])
REFERENCES [dbo].[Butacas] ([id_butaca])
GO
ALTER TABLE [dbo].[Tickets] CHECK CONSTRAINT [fk_ticket_butaca]
GO
ALTER TABLE [dbo].[Tickets]  WITH CHECK ADD  CONSTRAINT [fk_ticket_funcion] FOREIGN KEY([nro_funcion])
REFERENCES [dbo].[Funciones] ([nro_funcion])
GO
ALTER TABLE [dbo].[Tickets] CHECK CONSTRAINT [fk_ticket_funcion]
GO
USE [master]
GO
ALTER DATABASE [ComplejoCines] SET  READ_WRITE 
GO
