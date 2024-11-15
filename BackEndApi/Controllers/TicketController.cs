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