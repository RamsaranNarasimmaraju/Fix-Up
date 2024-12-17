using FIx_Up.Models;
using FIx_Up.Dtos.SolutionDtos; // Make sure to include the necessary DTOs
using FIx_Up.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FIx_Up.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SolutionsController : ControllerBase
    {
        private readonly IFixupRepository<Solution, SolutionReadDto, SolutionCreateDto, SolutionUpdateDto> _repo;

        public SolutionsController(IFixupRepository<Solution, SolutionReadDto, SolutionCreateDto, SolutionUpdateDto> repo)
        {
            _repo = repo;
        }

        // GET: api/<SolutionsController>
        [HttpGet]
        [Authorize(Roles = "Support Engineer,User")]

        public async Task<ActionResult<IEnumerable<SolutionReadDto>>> Get()
        {
            var Solutions = await _repo.GetAll(); // Get all Solutions as SolutionReadDto
            return Ok(Solutions);
        }

        // GET api/<SolutionsController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SolutionReadDto>> Get(int id)
        {
            var Solution = await _repo.GetById(id); // Get a Solution by ID as SolutionReadDto
            if (Solution == null)
            {
                return NotFound();
            }
            return Ok(Solution);
        }

        // POST api/<SolutionsController>
        [HttpPost]
        [Authorize(Roles ="Support Engineer")]
        public async Task<ActionResult<SolutionReadDto>> Post(SolutionCreateDto SolutionDto)
        {
            // Add a new Solution, and return the SolutionReadDto
            var Solution = await _repo.Add(SolutionDto);
            return CreatedAtAction(nameof(Get), new { id = Solution.SolutionId }, SolutionDto);
        }

        // PUT api/<SolutionsController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] SolutionUpdateDto SolutionDto)
        {
            if (id != SolutionDto.SolutionId)
            {
                return BadRequest();
            }

            // Update the Solution, passing the SolutionUpdateDto
            await _repo.Update(SolutionDto);
            return NoContent();
        }

        // DELETE api/<SolutionsController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _repo.Delete(id);
            return NoContent();
        }
    }
}
