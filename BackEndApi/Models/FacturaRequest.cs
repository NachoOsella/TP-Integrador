public class FacturaRequest
{
    public decimal MontoBase { get; set; }
    public int? CodPromocion { get; set; }
    public int IdCliente { get; set; }
    public int IdFormaDePago { get; set; }
    public int NroFuncion { get; set; }
    public int CantidadButacas { get; set; } // Nueva propiedad
}