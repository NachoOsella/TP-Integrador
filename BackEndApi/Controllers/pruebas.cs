using BackEndApi.Models;
using BackEndApi.Repositorys;
using BackEndApi.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BackEndApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PeliculasController : ControllerBase
    {
        private readonly CineDbContext _context;

        public PeliculasController(CineDbContext context)
        {
            _context = context;
        }

        [HttpGet("{idPelicula}/funciones-disponibles")]
        public async Task<IActionResult> GetFuncionesDisponibles(int idPelicula)
        {
            var funciones = await _context.Funciones
                .Where(f => f.IdPelicula == idPelicula && f.Capacidad > 0)
                .Select(f => new
                {
                    f.NroFuncion,
                    f.Dia,
                    f.Hora,
                    f.Capacidad
                })
                .ToListAsync();

            return Ok(funciones);
        }

        [HttpGet("promociones-activas")]
        public async Task<IActionResult> GetPromocionesActivas()
        {
            var promociones = await _context.Promociones
                .Where(p => DateTime.Now >= p.FecInicio && DateTime.Now <= p.FecFin)
                .Select(p => new
                {
                    p.CodPromocion,
                    p.Descripcion,
                    p.Descuento
                })
                .ToListAsync();

            return Ok(promociones);
        }

        [HttpPost("facturar")]
        public async Task<IActionResult> Facturar([FromBody] FacturaRequest request)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Calcular monto total
                    var promocion = await _context.Promociones
                        .FirstOrDefaultAsync(p => p.CodPromocion == request.CodPromocion);

                    var monto = request.MontoBase;

                    if (promocion != null)
                    {
                        monto -= (monto * (promocion.Descuento ?? 0) / 100);
                    }

                    // Crear factura
                    var factura = new Factura
                    {
                        Fecha = DateTime.Now,
                        Monto = monto,
                        IdCliente = request.IdCliente,
                        IdFormaDePago = request.IdFormaDePago,
                    };

                    _context.Facturas.Add(factura);
                    await _context.SaveChangesAsync();

                    // Crear detalle de la factura para cada butaca seleccionada
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

                    // Actualizar capacidad de la función
                    var funcion = await _context.Funciones
                        .FirstOrDefaultAsync(f => f.NroFuncion == request.NroFuncion);

                    if (funcion == null || funcion.Capacidad < request.CantidadButacas)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest("No hay capacidad disponible para la función seleccionada.");
                    }

                    funcion.Capacidad -= request.CantidadButacas; // Resta la cantidad correcta de butacas

                    // Guardar cambios
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return Ok(new { FacturaId = factura.NroFactura, MontoTotal = monto, funcion.Capacidad });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    // Captura y registra la excepción interna
                    var innerException = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                    return StatusCode(500, $"Error al procesar la factura: {innerException}");
                }
            }
        }
        [HttpGet("butacas-vendidas")]
        public async Task<IActionResult> GetButacasVendidas()
        {
            var butacasVendidas = await _context.DetalleFacturas
                .Join(_context.Funciones, df => df.NroFuncion, f => f.NroFuncion, (df, f) => new { df, f })
                .Join(_context.Peliculas, df_f => df_f.f.IdPelicula, p => p.IdPelicula, (df_f, p) => new { df_f.df, p })
                .GroupBy(g => new { g.p.Titulo, g.p.Url })
                .Select(g => new
                {
                    Pelicula = g.Key.Titulo,
                    Url = g.Key.Url,
                    ButacasVendidas = g.Count()
                })
                .OrderByDescending(g => g.ButacasVendidas)
                .ToListAsync();

            return Ok(butacasVendidas);
        }

        [HttpPost("agregar-funcion")]
        public async Task<IActionResult> AgregarFuncion([FromBody] FuncionDto nuevaFuncionDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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
                return CreatedAtAction(nameof(GetFuncion), new { id = nuevaFuncion.NroFuncion }, nuevaFuncion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al agregar la función: {ex.Message}");
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFuncion(int id)
        {
            var funcion = await _context.Funciones.FindAsync(id);

            if (funcion == null)
            {
                return NotFound();
            }

            return Ok(funcion);
        }

    }
}