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
        private readonly ICineRepository _cineRepository;

        public PeliculasController(ICineRepository cineRepository)
        {
            _cineRepository = cineRepository;
        }

        [HttpGet("{idPelicula}/funciones-disponibles")]
        public async Task<IActionResult> GetFuncionesDisponibles(int idPelicula)
        {
            var funciones = await _cineRepository.GetFuncionesDisponiblesAsync(idPelicula);
            return Ok(funciones);
        }

        [HttpPost("facturar")]
        public async Task<IActionResult> Facturar([FromBody] FacturaRequest request)
        {
            var (exito, mensaje, factura) = await _cineRepository.FacturarAsync(request);
            if (!exito)
            {
                return BadRequest(mensaje);
            }
            return Ok(new { FacturaId = factura.NroFactura, MontoTotal = factura.Monto });
        }

        [HttpGet("butacas-vendidas")]
        public async Task<IActionResult> GetButacasVendidas()
        {
            var butacasVendidas = await _cineRepository.GetButacasVendidasAsync();
            return Ok(butacasVendidas);
        }

        [HttpPost("agregar-funcion")]
        public async Task<IActionResult> AgregarFuncion([FromBody] FuncionDto nuevaFuncionDTO)
        {
            var (exito, mensaje, funcion) = await _cineRepository.AgregarFuncionAsync(nuevaFuncionDTO);
            if (!exito)
            {
                return BadRequest(mensaje);
            }
            return CreatedAtAction(nameof(GetFuncion), new { id = funcion.NroFuncion }, funcion);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFuncion(int id)
        {
            var funcion = await _cineRepository.GetFuncionAsync(id);
            if (funcion == null)
            {
                return NotFound();
            }
            return Ok(funcion);
        }

        [HttpGet("sucursales/{idSucursal}/salas")]
        public async Task<IActionResult> GetSalasBySucursal(int idSucursal)
        {
            var salas = await _cineRepository.GetSalasBySucursalAsync(idSucursal);
            if (salas == null || !salas.Any())
            {
                return NotFound("No se encontraron salas para la sucursal especificada.");
            }
            return Ok(salas);
        }
    }
}