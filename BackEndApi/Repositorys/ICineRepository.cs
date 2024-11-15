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
        List<Funcione> GetAllFunciones(); // para listar todas las funciones
        List<FormasDePago> GetAllFormasDePago(); // para listar todas las formas de pago
        List<Promocione> GetAllPromociones(); // para listar todas las promociones


        Task<List<Funcione>> GetFuncionesDisponiblesAsync(int idPelicula);
        Task<(bool exito, string mensaje, Factura factura)> FacturarAsync(FacturaRequest request);
        Task<List<ButacasVendidasDto>> GetButacasVendidasAsync();
        Task<(bool exito, string mensaje, Funcione funcion)> AgregarFuncionAsync(FuncionDto nuevaFuncionDTO);
        Task<Funcione> GetFuncionAsync(int id);
        Task<List<Sala>> GetSalasBySucursalAsync(int idSucursal);

    }
}
