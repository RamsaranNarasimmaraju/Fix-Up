using FIx_Up.Models;
using FIx_Up.Dtos.CustomIssueDtos; // Make sure to include the necessary DTOs
using FIx_Up.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FIx_Up.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomIssuesController : ControllerBase
    {
        private readonly IFixupRepository<CustomIssue, CustomIssueReadDto, CustomIssueCreateDto, CustomIssueUpdateDto> _repo;

        public CustomIssuesController(IFixupRepository<CustomIssue, CustomIssueReadDto, CustomIssueCreateDto, CustomIssueUpdateDto> repo)
        {
            _repo = repo;
        }

        // GET: api/<CustomIssuesController>
        [HttpGet]

        public async Task<ActionResult<IEnumerable<CustomIssueReadDto>>> Get()
        {
            var CustomIssues = await _repo.GetAll(); // Get all CustomIssues as CustomIssueReadDto
            return Ok(CustomIssues);
        }

        // GET api/<CustomIssuesController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomIssueReadDto>> Get(int id)
        {
            var CustomIssue = await _repo.GetById(id); // Get a CustomIssue by ID as CustomIssueReadDto
            if (CustomIssue == null)
            {
                return NotFound();
            }
            return Ok(CustomIssue);
        }

        // POST api/<CustomIssuesController>
        [HttpPost]
        [Authorize(Roles ="Support Engineer,User")]
        public async Task<ActionResult<CustomIssueReadDto>> Post(CustomIssueCreateDto CustomIssueDto)
        {
            // Add a new CustomIssue, and return the CustomIssueReadDto
            var CustomIssue = await _repo.Add(CustomIssueDto);
            return CreatedAtAction(nameof(Get), new { id = CustomIssue.CustomId }, CustomIssueDto);
        }

        // PUT api/<CustomIssuesController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] CustomIssueUpdateDto CustomIssueDto)
        {
            if (id != CustomIssueDto.CustomId)
            {
                return BadRequest();
            }

            // Update the CustomIssue, passing the CustomIssueUpdateDto
            await _repo.Update(CustomIssueDto);
            return NoContent();
        }

        // DELETE api/<CustomIssuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _repo.Delete(id);
            return NoContent();
        }
    }
}
