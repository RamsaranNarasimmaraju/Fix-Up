using FIx_Up.Models;
using FIx_Up.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FIx_Up.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardsController : ControllerBase
    {
        private readonly IDashboardRepo<Dashboard> _repo;
        public DashboardsController(IDashboardRepo<Dashboard> repo)
        {
            _repo = repo;
        }
        // GET: api/<DashboardsController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Dashboard>>> Get()
        {
            return Ok(await _repo.GetAll());
        }
    }
}
