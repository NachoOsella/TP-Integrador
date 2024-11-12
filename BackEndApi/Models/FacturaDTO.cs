namespace BackEndApi.Models;
// FacturaDTO.cs
public class FacturaDTO
{
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
    public int IdFormaDePago { get; set; }
    public int? IdCliente { get; set; }
    public List<DetalleFacturaDTO> DetalleFacturas { get; set; }
}
