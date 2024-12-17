using FIx_Up.Models;
using FIx_Up.Dtos.RoleDtos; // Make sure to include the necessary DTOs
using FIx_Up.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FIx_Up.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IFixupRepository<Role, RoleReadDto, RoleCreateDto, RoleUpdateDto> _repo;

        public RolesController(IFixupRepository<Role, RoleReadDto, RoleCreateDto, RoleUpdateDto> repo)
        {
            _repo = repo;
        }

        // GET: api/<RolesController>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<RoleReadDto>>> Get()
        {
            var Roles = await _repo.GetAll(); // Get all Roles as RoleReadDto
            return Ok(Roles);
        }

        // GET api/<RolesController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleReadDto>> Get(int id)
        {
            var Role = await _repo.GetById(id); // Get a Role by ID as RoleReadDto
            if (Role == null)
            {
                return NotFound();
            }
            return Ok(Role);
        }

        // POST api/<RolesController>
        [HttpPost]
        public async Task<ActionResult<RoleReadDto>> Post(RoleCreateDto RoleDto)
        {
            // Add a new Role, and return the RoleReadDto
            var Role = await _repo.Add(RoleDto);
            return CreatedAtAction(nameof(Get), new { id = Role.RoleId }, RoleDto);
        }

        // PUT api/<RolesController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] RoleUpdateDto RoleDto)
        {
            if (id != RoleDto.RoleId)
            {
                return BadRequest();
            }

            // Update the Role, passing the RoleUpdateDto
            await _repo.Update(RoleDto);
            return NoContent();
        }

        // DELETE api/<RolesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _repo.Delete(id);
            return NoContent();
        }
    }
}
