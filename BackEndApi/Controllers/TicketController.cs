using BackEndApi.Models;
using BackEndApi.Repositorys;
using BackEndApi.ViewModels;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackEndApi.Controllers
{
    [EnableCors("AllowAll")]
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly ICineRepository _repository;
        private readonly CineDbContext _context;

        public TicketController(ICineRepository repository, CineDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        // Métodos existentes...
        [HttpPost("RegistrarTransaccion")]
        public async Task<IActionResult> RegistrarTransaccion([FromBody] FacturaDTO facturaDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Crear la entidad Factura a partir del DTO
                var factura = new Factura
                {
                    Monto = facturaDto.Monto,
                    Fecha = DateTime.Now,
                    IdFormaDePago = facturaDto.IdFormaDePago,
                    IdCliente = facturaDto.IdCliente
                };

                // Agregar la factura al contexto
                _context.Facturas.Add(factura);
                await _context.SaveChangesAsync();

                // Iterar sobre los detalles y agregarlos
                foreach (var detalleDto in facturaDto.DetalleFacturas)
                {
                    var detalle = new DetalleFactura
                    {
                        NroFactura = factura.NroFactura,
                        NroFuncion = detalleDto.NroFuncion,
                        CodPromocion = detalleDto.CodPromocion
                    };
                    _context.DetalleFacturas.Add(detalle);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok("Transacción registrada con éxito");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest("Error al registrar la transacción: " + ex.Message);
            }
        }

        // getall formas de pago
        [HttpGet("GetAllFormasDePago")]
        public IActionResult GetAllFormasDePago()
        {
            var formasDePago = _repository.GetAllFormasDePago();
            return Ok(formasDePago);
        }

        // getall promociones
        [HttpGet("GetAllPromociones")]
        public IActionResult GetAllPromociones()
        {
            var promociones = _repository.GetAllPromociones();
            return Ok(promociones);
        }

    }
}