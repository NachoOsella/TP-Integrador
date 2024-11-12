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
    public class CineController : ControllerBase
    {
        private ICineRepository _repository;
        public CineController(ICineRepository repository) //llamamos al repositorio 
        {
            _repository = repository;
        }

        //-CRUD-

        [HttpGet("GetPeliculas")]
        public IActionResult Get()
        {
            try
            {
                return Ok(_repository.GetAll());
            }
            catch (Exception)
            {

                return StatusCode(500, "Ha ocurrido un error interno");
            }
        }
        // get by id
        [HttpGet("GetPelicula/{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                var pelicula = _repository.GetById(id);
                if (pelicula == null)
                {
                    return NotFound("No se encontro la pelicula");
                }
                return Ok(pelicula);
            }
            catch (Exception)
            {
                return StatusCode(500, "Ha ocurrido un error interno");
            }
        }

        [HttpGet("GetDirectores")]
        public IActionResult GetDirectores()
        {
            try
            {
                return Ok(_repository.GetAllDirectores());
            }
            catch (Exception)
            {

                return StatusCode(500, "Ha ocurrido un error interno");
            }
        }

        [HttpGet("GetGeneros")]
        public IActionResult GetGeneros()
        {
            try
            {
                return Ok(_repository.GetAllGenerosPeli());
            }
            catch (Exception)
            {

                return StatusCode(500, "Ha ocurrido un error interno");
            }
        }

        [HttpGet("GetEdades")]
        public IActionResult GetEdades()
        {
            try
            {
                return Ok(_repository.GetAllEdades());
            }
            catch (Exception)
            {

                return StatusCode(500, "Ha ocurrido un error interno");
            }
        }

        [HttpPost("RegistrarPelicula")]
        public IActionResult Post([FromBody] Pelicula pelicula)
        {
            try
            {
                if (isValid(pelicula))
                {
                    _repository.Create(pelicula);
                    return Ok("Pelicula registrada con éxito!");
                }
                else
                {
                    return BadRequest("Debe completar los campos obligatorios!");
                }

            }
            catch (Exception)
            {
                return BadRequest("Debe completar los campos obligatorios!");

            }
        }

        private bool isValid(Pelicula pelicula)
        {
            return !string.IsNullOrEmpty(pelicula.Titulo) && !string.IsNullOrEmpty(pelicula.Descripcion) && pelicula.Duracion != null
                    && pelicula.IdGenero != null && pelicula.IdDirector != null && pelicula.IdEdad != null;
        }

        [HttpPut("PutPelicula/{id}")]
        public IActionResult Put(int id, [FromBody] Pelicula opelicula)
        {
            var resultado = _repository.Update(id, opelicula);
            try
            {
                if (resultado)
                {
                    return Ok("Pelicula actualizada con exito");
                }
                return BadRequest("Complete los campos necesarios");
            }
            catch (Exception)
            {
                return StatusCode(500, "Ha ocurrio un error");
            }
        }

        [HttpDelete("DeletePelicula/{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                if (_repository.Delete(id))
                {
                    return Ok($"La pelicula  {id} se deshabilito exitosamente");
                }
                else
                {
                    return NotFound("No se encontro una pelicula habilitada con ese ID");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error interno: " + ex.Message);
            }
        }

        [HttpGet("GetFunciones")]
        public IActionResult GetFunciones()
        {
            try
            {
                var funciones = _repository.GetAllFunciones();
                if (funciones == null || !funciones.Any())
                {
                    return NotFound("No se encontraron funciones disponibles.");
                }
                return Ok(funciones);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ha ocurrido un error interno: " + ex.Message);
            }
        }
    }
}
