namespace BackEndApi.Models;
public class FuncionDto
{
    public int NroFuncion { get; set; }
    public DateTime Dia { get; set; }
    public DateTime Hora { get; set; }
    public int IdPelicula { get; set; }
    public int NroSala { get; set; }
    public int Capacidad { get; set; }
}