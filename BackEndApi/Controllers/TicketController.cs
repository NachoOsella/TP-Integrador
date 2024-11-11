using BackEndApi.Models;
using BackEndApi.Repositorys;
using BackEndApi.ViewModels;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackEndApi.Controllers
{
    [EnableCors("AllowAll")]
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private ICineRepository _repository;
        public TicketController(ICineRepository repository) //llamamos al repositorio 
        {
            _repository = repository;
        }

        [HttpGet("/api"+"/Butcas"+"/GetButacas")]
        public IActionResult GetButacas()
        {
            try
            {
                return Ok(_repository.GetButacas());
            }
            catch (Exception)
            {

                return StatusCode(500, "Ha ocurrido un error interno");
            }
        }

        [HttpGet("/api"+"/Salas"+"/GetSalas")]
        public IActionResult GetSalas()
        {
            try
            {
                return Ok(_repository.GetSalas());
            }
            catch (Exception)
            {

                return StatusCode(500, "Ha ocurrido un error interno");
            }
        }

        [HttpGet("GetTickets")]
        public IActionResult GetTickets()
        {
            try
            {
                return Ok(_repository.GetTickets());
            }
            catch (Exception)
            {

                return StatusCode(500, "Ha ocurrido un error interno");
            }
        }

        [HttpPost("RegistrarTicket")]
        public IActionResult Post([FromBody] Ticket ticket)
        {
            try
            {
                _repository.CreateTicket(ticket);
                return Ok("Ticket registrado con éxito!");
            }
            catch (Exception)
            {
                return BadRequest("Debe completar los campos obligatorios!");

            }
        }

        [HttpDelete("DeleteTicket/{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                if (_repository.DeleteTicket(id))
                {
                    return Ok($"El ticket nro {id} se elimino exitosamente");
                }
                else
                {
                    return NotFound("No se encontro un ticket con ese ID");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error interno: " + ex.Message);
            }

        }
    }
}
