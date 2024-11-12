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
            var now = DateTime.Now;
            // guardar la hora actual
            return _context.Funciones.Where(f => f.Dia >= now).ToList();
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



                // Guarda los cambios en la base de datos
                return _context.SaveChanges() == 1; // Devuelve true si la actualización fue exitosa
            }
            return false; // Devuelve false si no se encontró la película
        }

        //Transaccion

        public bool CreateTicket(Ticket oTicket)
        {
            _context.Tickets.Add(oTicket); // Crea un ticket gracias al objeto ticket
            return _context.SaveChanges() == 1;
        }

        public bool DeleteTicket(int id) //baja logica, busca por id y elimina el ticket, desocupando la butaca
        {
            var ticket = _context.Tickets.FirstOrDefault(t => t.NroTicket == id);
            if (ticket != null)
            {
                _context.Tickets.Remove(ticket);
                return _context.SaveChanges() == 1;
            }
            else return false;
        }

        public List<Ticket> GetTickets() //llama a todos los tickets
        {
            return _context.Tickets.Include(t => t.NroFuncion).Include(t => t.IdButaca).ToList();
        }
        public List<Butaca> GetButacas() //llama a todas las butacas
        {
            return _context.Butacas.Include(b => b.NroSala).Include(b => b.IdTipoButaca).ToList();
        }
        public List<Sala> GetSalas() //llama a todas las salas
        {
            return _context.Salas.Include(s => s.IdTipoSala).Include(s => s.IdSucursal).ToList();
        }

    }
}