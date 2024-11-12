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

        // Registrar transacción
        [HttpPost("RegistrarTransaccion")]
        public async Task<IActionResult> RegistrarTransaccion([FromBody] FacturaDTO facturaDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // con los datos de la factura, crear una nueva factura
                var factura = new Factura
                {
                    Monto = facturaDto.Monto,
                    Fecha = DateTime.Now,
                    IdFormaDePago = facturaDto.IdFormaDePago,
                    IdCliente = facturaDto.IdCliente
                };

                // Agregar la factura al contexto y guardar los cambios
                _context.Facturas.Add(factura);
                await _context.SaveChangesAsync();

                // Por cada detalle de factura en la lista de detalles de factura, crear un nuevo detalle de factura
                foreach (var detalleDto in facturaDto.DetalleFacturas)
                {
                    var detalle = new DetalleFactura
                    {
                        NroFactura = factura.NroFactura,
                        NroFuncion = detalleDto.NroFuncion,
                        CodPromocion = detalleDto.CodPromocion
                    };
                    // Agregar el detalle de factura al contexto
                    _context.DetalleFacturas.Add(detalle);
                }

                // Guardar los cambios
                await _context.SaveChangesAsync();
                // Commit de la transacción
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