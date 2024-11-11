using BackEndApi.Models;
using BackEndApi.ViewModels;

namespace BackEndApi.Repositorys
{
    public interface ICineRepository
    {
        Task<(bool exito, string mensaje)> RegisterAsync(ClienteVM modelo);
        Task<(bool exito, string mensaje)> LoginAsync(LoginVM modelo);

        //-CRUD-
        List<Pelicula> GetAll(); // para listar todas las peliculas
        // get by id
        Pelicula GetById(int id);
        List<Directore> GetAllDirectores();
        List<Edade> GetAllEdades();
        List<GenerosPeli> GetAllGenerosPeli();
        bool Create(Pelicula oPelicula); // para crear una pelicula
        bool Update(int id, Pelicula oPelicula);  //para modificar una descripcion 
        bool Delete(int id); // para dar de baja una pelicula

        //-Transaccion
        List<Ticket> GetTickets(); // para listar todos los tickets
        List<Butaca> GetButacas(); // para listar todas las butacas
        List<Sala> GetSalas(); // para listar todas las salas
        bool CreateTicket(Ticket ticket); // para crear un ticket
        bool DeleteTicket(int id); // para dar de baja un ticket
    }
}
