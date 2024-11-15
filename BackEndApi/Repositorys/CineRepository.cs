using BackEndApi.Models;
using BackEndApi.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace BackEndApi.Repositorys
{
    public class CineRepository : ICineRepository
    {
        CineDbContext _context;
        public CineRepository(CineDbContext context)
        {
            _context = context;
        }

        //Register
        public async Task<(bool exito, string mensaje)> RegisterAsync(ClienteVM modelo)
        {
            if (modelo.Contraseña != modelo.RepetirContraseña)
            {
                return (false, "Las contraseñas no coinciden");
            }

            Cliente cliente = new Cliente
            {
                Nombre = modelo.Nombre,
                Apellido = modelo.Apellido,
                Telefono = modelo.Telefono,
                IdTipoDoc = modelo.IdTipoDoc,
                Dni = modelo.Dni,
                Mail = modelo.Mail,
                Contraseña = modelo.Contraseña
            };

            await _context.Clientes.AddAsync(cliente);
            await _context.SaveChangesAsync();

            if (cliente.IdCliente != 0)
            {
                return (true, "Usuario registrado exitosamente");
            }

            return (false, "No se pudo crear el usuario");
        }

        //Login
        public async Task<(bool exito, string mensaje)> LoginAsync(LoginVM modelo)
        {
            var cliente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.Mail == modelo.Mail && c.Contraseña == modelo.Contraseña);

            if (cliente == null)
            {
                return (false, "No se encontraron coincidencias");
            }

            return (true, "Inicio de sesión exitoso");
        }

        //-CRUD-

        public bool Create(Pelicula oPelicula)
        {
            _context.Peliculas.Add(oPelicula); // Crea una pelicula gracias al objeto pelicula
            return _context.SaveChanges() == 1;
        }

        public bool Delete(int id) //baja logica, busca por id y si esa pelicula esta en estreno, se da de baja, first para el primer elemento q cumple la condicion
        {
            var pelicula = _context.Peliculas.Where(pelicula => pelicula.IdPelicula == id && pelicula.Estreno == true).ToList().FirstOrDefault();
            if (pelicula != null)
            {
                pelicula.Estreno = false;
            }
            return _context.SaveChanges() > 0;
        }

        public List<Pelicula> GetAll() //llama a todas las peliculas que esten en estreno
        {
            return _context.Peliculas.Where(pelicula => pelicula.Estreno == true)
                .Include(p => p.IdGeneroNavigation).Include(p => p.IdEdadNavigation).Include(p => p.IdDirectorNavigation).ToList();
        }

        public Pelicula GetById(int id)
        {
            return _context.Peliculas.Find(id);
        }

        public List<Directore> GetAllDirectores()
        {
            return _context.Directores.ToList();
        }

        public List<Edade> GetAllEdades()
        {
            return _context.Edades.ToList();
        }

        public List<GenerosPeli> GetAllGenerosPeli()
        {
            return _context.GenerosPelis.ToList();
        }

        public List<Funcione> GetAllFunciones()
        {
            // retornar todas las funciones que tengan el dia de hoy o en adelante
            return _context.Funciones.Where(f => f.Dia >= DateTime.Now).ToList();
        }

        public List<FormasDePago> GetAllFormasDePago()
        {
            return _context.FormasDePagos.ToList();
        }

        public List<Promocione> GetAllPromociones()
        {
            return _context.Promociones.ToList();
        }

        public bool Update(int id, Pelicula opelicula) // update de nueva descripcion de pelicula
        {

            var pelicula = _context.Peliculas.Find(id); // Busca la película por id
            if (pelicula != null)
            {
                // Actualiza solo los campos que no sean nulos
                if (!string.IsNullOrEmpty(opelicula.Titulo))
                    pelicula.Titulo = opelicula.Titulo;

                if (opelicula.IdGenero.HasValue)
                    pelicula.IdGenero = opelicula.IdGenero.Value;

                if (opelicula.IdEdad.HasValue)
                    pelicula.IdEdad = opelicula.IdEdad.Value;

                if (opelicula.Duracion.HasValue)
                    pelicula.Duracion = opelicula.Duracion.Value;

                if (!string.IsNullOrEmpty(opelicula.Descripcion))
                    pelicula.Descripcion = opelicula.Descripcion;

                if (opelicula.IdDirector.HasValue)
                    pelicula.IdDirector = opelicula.IdDirector.Value;
                if (opelicula.Url != null)
                    pelicula.Url = opelicula.Url;



                // Guarda los cambios en la base de datos
                return _context.SaveChanges() == 1; // Devuelve true si la actualización fue exitosa
            }
            return false; // Devuelve false si no se encontró la película
        }


        public async Task<List<Funcione>> GetFuncionesDisponiblesAsync(int idPelicula)
        {
            return await _context.Funciones
                .Where(f => f.IdPelicula == idPelicula && f.Capacidad > 0)
                .Select(f => new Funcione
                {
                    NroFuncion = f.NroFuncion,
                    Dia = f.Dia,
                    Hora = f.Hora,
                    Capacidad = f.Capacidad
                })
                .ToListAsync();
        }

        public async Task<(bool exito, string mensaje, Factura factura)> FacturarAsync(FacturaRequest request)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var promocion = await _context.Promociones
                        .FirstOrDefaultAsync(p => p.CodPromocion == request.CodPromocion);

                    var monto = request.MontoBase;

                    if (promocion != null)
                    {
                        monto -= (monto * (promocion.Descuento ?? 0) / 100);
                    }

                    var factura = new Factura
                    {
                        Fecha = DateTime.Now,
                        Monto = monto,
                        IdCliente = request.IdCliente,
                        IdFormaDePago = request.IdFormaDePago,
                    };

                    _context.Facturas.Add(factura);
                    await _context.SaveChangesAsync();

                    for (int i = 0; i < request.CantidadButacas; i++)
                    {
                        var detalleFactura = new DetalleFactura
                        {
                            NroFactura = factura.NroFactura,
                            NroFuncion = request.NroFuncion,
                            CodPromocion = request.CodPromocion
                        };

                        _context.DetalleFacturas.Add(detalleFactura);
                    }

                    var funcion = await _context.Funciones
                        .FirstOrDefaultAsync(f => f.NroFuncion == request.NroFuncion);

                    if (funcion == null || funcion.Capacidad < request.CantidadButacas)
                    {
                        await transaction.RollbackAsync();
                        return (false, "No hay capacidad disponible para la función seleccionada.", null);
                    }

                    funcion.Capacidad -= request.CantidadButacas;

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return (true, "Factura procesada exitosamente.", factura);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    var innerException = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                    return (false, $"Error al procesar la factura: {innerException}", null);
                }
            }
        }

        public async Task<List<ButacasVendidasDto>> GetButacasVendidasAsync()
        {
            return await _context.DetalleFacturas
                .Join(_context.Funciones, df => df.NroFuncion, f => f.NroFuncion, (df, f) => new { df, f })
                .Join(_context.Peliculas, df_f => df_f.f.IdPelicula, p => p.IdPelicula, (df_f, p) => new { df_f.df, p })
                .GroupBy(g => new { g.p.Titulo, g.p.Url })
                .Select(g => new ButacasVendidasDto
                {
                    Pelicula = g.Key.Titulo,
                    Url = g.Key.Url,
                    ButacasVendidas = g.Count()
                })
                .OrderByDescending(g => g.ButacasVendidas)
                .ToListAsync();
        }

        public async Task<(bool exito, string mensaje, Funcione funcion)> AgregarFuncionAsync(FuncionDto nuevaFuncionDTO)
        {
            if (nuevaFuncionDTO == null)
            {
                return (false, "Datos de la función no válidos.", null);
            }

            try
            {
                var nuevaFuncion = new Funcione
                {
                    NroFuncion = nuevaFuncionDTO.NroFuncion,
                    Dia = nuevaFuncionDTO.Dia,
                    Hora = nuevaFuncionDTO.Hora,
                    IdPelicula = nuevaFuncionDTO.IdPelicula,
                    NroSala = nuevaFuncionDTO.NroSala,
                    Capacidad = nuevaFuncionDTO.Capacidad
                };

                _context.Funciones.Add(nuevaFuncion);
                await _context.SaveChangesAsync();
                return (true, "Función agregada exitosamente.", nuevaFuncion);
            }
            catch (Exception ex)
            {
                return (false, $"Error al agregar la función: {ex.Message}", null);
            }
        }

        public async Task<Funcione> GetFuncionAsync(int id)
        {
            return await _context.Funciones.FindAsync(id);
        }

        public async Task<List<Sala>> GetSalasBySucursalAsync(int idSucursal)
        {
            return await _context.Salas
                .Where(s => s.IdSucursal == idSucursal)
                .ToListAsync();
        }


    }
}