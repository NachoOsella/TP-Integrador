using BackEndApi.Repositorys;
using BackEndApi.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackEndApi.Controllers
{
    [EnableCors("AllowAll")]
    [Route("api/[controller]")]
    [ApiController]
    public class ClienteController : ControllerBase
    {
        private ICineRepository _repository;
        public ClienteController(ICineRepository repository) //llamamos al repositorio 
        {
            _repository = repository;
        }

        //Registrar un Usuario
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] ClienteVM modelo)
        {
            var (exito, mensaje) = await _repository.RegisterAsync(modelo);
            if (!exito)
            {
                return BadRequest(new { mensaje });
            }
            return Ok(new { mensaje });
        }

        //Loguear un Usuario
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginVM modelo)
        {
            var (exito, mensaje) = await _repository.LoginAsync(modelo);
            if (!exito)
            {
                return NotFound(new { mensaje });
            }
            return Ok(new { mensaje });
        }
    }
}
